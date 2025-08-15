import ModbusRTU from "modbus-serial";

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

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const timeoutPromise = (promise, ms, timeoutMessage = 'Timeout') =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(timeoutMessage)), ms))
  ]);

async function connectClient(client, ip, port, unitId, name) {
  try {
    await client.connectTCP(ip, { port });
    client.setID(unitId);
    console.log(`[${name}] Connected to ${ip}:${port}`);
    return true;
  } catch (err) {
    console.error(`[${name}] Connection error:`, err.message);
    return false;
  }
}

async function bridgePLC(config) {
  const clientSource = new ModbusRTU();
  const clientTargets = config.targets.map(() => new ModbusRTU());

  const sourceConnected = await connectClient(
    clientSource,
    config.source.ip,
    config.source.port,
    config.source.unitId,
    `${config.name} - Source`
  );

  if (!sourceConnected) return;

  for (let i = 0; i < config.targets.length; i++) {
    const ok = await connectClient(
      clientTargets[i],
      config.targets[i].ip,
      config.targets[i].port,
      config.targets[i].unitId,
      `${config.targets[i].name}`
    );
    if (!ok) return;
  }

  console.log(`[${config.name}] Bridge started...`);

  while (true) {
    try {
      // 1. Baca dari Source dengan timeout
      const data = await timeoutPromise(
        clientSource.readHoldingRegisters(config.source.readAddr, config.source.qty),
        3000,
        "Source Read Timeout"
      );

      const value = data.data[0];

      // 2. Kirim ke semua target
      for (let i = 0; i < config.targets.length; i++) {
        const target = config.targets[i];
        const client = clientTargets[i];

        try {
          await timeoutPromise(
            client.writeRegister(target.writeAddr, value),
            2000,
            "Write Timeout"
          );

          await timeoutPromise(
            client.writeCoil(target.errorReg, 0),
            2000,
            "Reset ErrorReg Timeout"
          );

          console.log(`[${target.name}] Write OK: ${value}`);
        } catch (err) {
          console.error(`[${target.name}] Write error:`, err.message);

          try {
            await timeoutPromise(
              client.writeCoil(target.errorReg, 1),
              1000,
              "Set ErrorReg Timeout"
            );
          } catch (e) {
            console.error(`[${target.name}] Set errorReg failed:`, e.message);
          }

          // Reconnect target jika write gagal karena koneksi
          if (["Timed out", "ECONNRESET", "Client Not Ready"].some(msg => err.message.includes(msg))) {
            console.warn(`[${target.name}] Reconnecting...`);
            try {
              client.close();
              await connectClient(client, target.ip, target.port, target.unitId, target.name);
            } catch (reconnectErr) {
              console.error(`[${target.name}] Reconnect failed:`, reconnectErr.message);
            }
          }
        }
      }
    } catch (err) {
      console.error(`[${config.name}] Source read error:`, err.message);

      // Reconnect jika source read gagal karena koneksi
      if (["Timed out", "ECONNRESET", "Client Not Ready"].some(msg => err.message.includes(msg))) {
        console.warn(`[${config.name}] Reconnecting source...`);
        try {
          clientSource.close();
          await connectClient(
            clientSource,
            config.source.ip,
            config.source.port,
            config.source.unitId,
            `${config.name} - Source`
          );
        } catch (reconnectErr) {
          console.error(`[${config.name}] Source reconnect failed:`, reconnectErr.message);
        }
      }
    }

    await delay(config.source.interval);
  }
}

// Jalankan semua interlocks
for (const interlock of interlocks) {
  bridgePLC(interlock).catch(err =>
    console.error(`[${interlock.name}] Fatal bridge error:`, err.message)
  );
}