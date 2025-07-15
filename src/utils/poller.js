import ModbusRTU from "modbus-serial";

const plcs = [
    {
        name: "supiturang01",
        ip: "192.168.0.11",
        port: 502,
        unitId: 1,
        readAddr: 3002,
        qty: 2,
        interval: 5500
    },
    {
        name: "supiturang02",
        ip: "192.168.1.11",
        port: 502,
        unitId: 1,
        readAddr: 3002,
        qty: 2,
        interval: 5500
    },
];

async function pollPLC(config) {
    const client = new ModbusRTU();

    while (true) {
        try {
            console.log(`[${config.name}] Connecting to ${config.ip}:${config.port}...`);
            await client.connectTCP(config.ip, { port: config.port });
            client.setID(config.unitId);
            console.log(`[${config.name}] Connected.`);

            while (true) {
                try {
                    const data = await client.readHoldingRegisters(config.readAddr, config.qty);
                    const floatValue = data.buffer.readFloatBE(0).toFixed(2);
                    const scaledValue = Math.round(parseFloat(floatValue) * 100);
                    console.log(`[${config.name}] Value: ${scaledValue}`);
                } catch (error) {
                    console.error(`[${config.name}] Read error: ${error.message}`);
                    // putus koneksi supaya connect ulang
                    client.close();
                    break; // keluar dari inner while, akan reconnect
                }

                await new Promise((r) => setTimeout(r, config.interval));
            }

        } catch (error) {
            console.error(`[${config.name}] Connection error: ${error.message}`);
        }

        console.log(`[${config.name}] Reconnecting in 5 seconds...`);
        await new Promise((r) => setTimeout(r, 5000));
    }
}

for (const plc of plcs) {
    pollPLC(plc);
}