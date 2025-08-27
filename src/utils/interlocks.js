import ModbusRTU from "modbus-serial";

// ======================= CONFIG =======================
const interlocks = [
  {
    name: "supiturang01",
    source: {
      ip: "192.168.0.25",
      port: 502,
      unitId: 1,
      readAddr: 46,
      qty: 1,
      interval: 1000 // ms
    },
    targets: [
      {
        name: "supiturang02",
        ip: "192.168.1.25",
        port: 502,
        unitId: 1,
        writeAddr: 46,
        errorReg: 53
      }
    ]
  }
];

// ======================= UTILITIES =======================
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const timeoutPromise = (promise, ms, timeoutMessage = "Timeout") =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), ms))
  ]);

async function connectClient(client, ip, port, unitId, name) {
  try {
    await client.connectTCP(ip, { port });
    client.setID(unitId);
    console.log(`[${name}] ✅ Connected to ${ip}:${port}`);
    return true;
  } catch (err) {
    console.error(`[${name}] ❌ Connect error: ${err.message}`);
    return false;
  }
}

async function safeReconnect(client, ip, port, unitId, name, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      client.close();
      await delay(300); // tunggu socket rilis
      const ok = await connectClient(client, ip, port, unitId, name);
      if (ok) return true;
    } catch (err) {
      console.error(`[${name}] Reconnect failed (${i + 1}/${retries}): ${err.message}`);
    }
    await delay(1000);
  }
  console.warn(`[${name}] ❌ All reconnect attempts failed`);
  return false;
}

// ======================= HEARTBEAT MONITOR =======================
function startHeartbeatMonitor(statusMap, threshold = 30000) {
  setInterval(() => {
    const now = Date.now();
    for (const [name, lastActive] of statusMap.entries()) {
      if (now - lastActive > threshold) {
        console.warn(`[HEARTBEAT] ⚠ ${name} offline lebih dari ${Math.floor((now - lastActive) / 1000)} detik!`);
      }
    }
  }, 10000); // cek setiap 10 detik
}

// ======================= MAIN BRIDGE =======================
async function bridgePLC(config) {
  const clientSource = new ModbusRTU();
  const clientTargets = config.targets.map(() => new ModbusRTU());
  const connectionStatus = new Map();
  let backoff = 1000; // start 1 detik, max 15 detik

  const sourceName = `${config.name} - Source`;

  // Koneksi awal ke source
  const sourceConnected = await connectClient(
    clientSource,
    config.source.ip,
    config.source.port,
    config.source.unitId,
    sourceName
  );

  if (!sourceConnected) {
    console.error(`[${config.name}] Gagal koneksi awal ke source, coba ulang dalam 5 detik...`);
    await delay(5000);
    return bridgePLC(config); // coba lagi
  }
  connectionStatus.set(sourceName, Date.now());

  // Koneksi awal ke semua target
  for (let i = 0; i < config.targets.length; i++) {
    const target = config.targets[i];
    const ok = await connectClient(clientTargets[i], target.ip, target.port, target.unitId, target.name);
    if (ok) connectionStatus.set(target.name, Date.now());
    else console.error(`[${target.name}] Gagal koneksi awal, skip target ini`);
  }

  // Mulai heartbeat monitor
  startHeartbeatMonitor(connectionStatus);

  console.log(`[${config.name}] Bridge started...`);

  while (true) {
    try {
      // Pastikan source masih open
      if (!clientSource.isOpen) {
        console.warn(`[${config.name}] Source disconnected, reconnecting...`);
        const reconnected = await safeReconnect(
          clientSource,
          config.source.ip,
          config.source.port,
          config.source.unitId,
          sourceName
        );
        if (!reconnected) {
          console.error(`[${config.name}] Source masih gagal, retry in ${backoff}ms`);
          await delay(backoff);
          backoff = Math.min(backoff * 2, 15000);
          continue;
        }
      }

      // 1. Baca data source
      const data = await timeoutPromise(
        clientSource.readHoldingRegisters(config.source.readAddr, config.source.qty),
        3000,
        "Source Read Timeout"
      );

      const value = data.data[0];
      backoff = 1000; // reset backoff saat sukses
      connectionStatus.set(sourceName, Date.now());

      // 2. Tulis ke semua target
      for (let i = 0; i < config.targets.length; i++) {
        const target = config.targets[i];
        const client = clientTargets[i];

        if (!client.isOpen) {
          console.warn(`[${target.name}] Client disconnected, reconnecting...`);
          const ok = await safeReconnect(client, target.ip, target.port, target.unitId, target.name);
          if (!ok) {
            console.error(`[${target.name}] Skip write, masih gagal konek`);
            continue;
          }
        }

        try {
          await timeoutPromise(client.writeRegister(target.writeAddr, value), 2000, "Write Timeout");
          await timeoutPromise(client.writeCoil(target.errorReg, 0), 2000, "Reset ErrorReg Timeout");

          console.log(`[${target.name}] ✅ Write OK: ${value}`);
          connectionStatus.set(target.name, Date.now());
        } catch (err) {
          console.error(`[${target.name}] ❌ Write error: ${err.message}`);

          // Set error register = 1
          try {
            await timeoutPromise(client.writeCoil(target.errorReg, 1), 1000, "Set ErrorReg Timeout");
          } catch (e) {
            console.error(`[${target.name}] Gagal set errorReg: ${e.message}`);
          }

          // Reconnect jika perlu
          if (["Timed out", "ECONNRESET", "Client Not Ready"].some(msg => err.message.includes(msg))) {
            console.warn(`[${target.name}] Reconnecting...`);
            await safeReconnect(client, target.ip, target.port, target.unitId, target.name);
          }
        }
      }
    } catch (err) {
      console.error(`[${config.name}] Source read error: ${err.message}`);
    }

    await delay(config.source.interval);
  }
}

// ======================= START =======================
for (const interlock of interlocks) {
  bridgePLC(interlock).catch(err =>
    console.error(`[${interlock.name}] Fatal bridge error:`, err.message)
  );
}