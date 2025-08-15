import ModbusRTU from "modbus-serial";

const interlocks = [
  {
    name: "supiturang01",
    source: {
      ip: "192.168.0.25",
      port: 502,
      unitId: 1,
      readAddr: 46, // 47
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
        errorReg: 53 //
      }
    ]
  }
];

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function bridgePLC(config) {
  const clientSource = new ModbusRTU();
  const clientTargets = config.targets.map(() => new ModbusRTU());

  // Connect Source
  await clientSource.connectTCP(config.source.ip, { port: config.source.port });
  clientSource.setID(config.source.unitId);

  // Connect Target(s)
  for (let i = 0; i < config.targets.length; i++) {
    await clientTargets[i].connectTCP(config.targets[i].ip, {
      port: config.targets[i].port
    });
    clientTargets[i].setID(config.targets[i].unitId);
  }

  console.log(`[${config.name}] Bridge started...`);

  while (true) {
    try {
      // 1. Read from Source
      const data = await clientSource.readHoldingRegisters(
        config.source.readAddr,
        config.source.qty
      );
      const value = data.data[0];
      // 2. Kirim ke semua target
      for (let i = 0; i < config.targets.length; i++) {
        const target = config.targets[i];
        try {
          await clientTargets[i].writeRegister(target.writeAddr, value);
          console.log(`[${target.name}] Write value ${value}`);
          await clientTargets[i].writeCoil(target.errorReg, 0)
        } catch (err) {
          await clientTargets[i].writeCoil(target.errorReg, 1)
          console.error(`[${target.name}] Write error:`, err.message);
        }
      }
    } catch (err) {
      console.error(`[${config.name}] Read error:`, err.message);
    }

    await delay(config.source.interval);
  }
}

// Jalankan semua interlocks
for (const interlock of interlocks) {
  bridgePLC(interlock);
}