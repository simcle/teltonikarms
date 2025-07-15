import ModbusRTU from "modbus-serial";

const plcs = [
    {
        name: "supiturang01",
        ip: "192.168.1.25",
        port: 502,
        unitId: 1,
        readAddr:46,
        val: 1853,
        interval: 5500
    }
]


async function pollPLC(config) {
    const client = new ModbusRTU()
    try {
        await client.connectTCP(config.ip, {port: config.port})
        client.setID(config.unitId)
        
        
        while(true) {
            try {
                config.val += 1
                const data = await client.writeRegister(config.readAddr, config.val)
                console.log(data)
            } catch (error) {
                console.log(error)
            }
            await new Promise((r) => setTimeout(r, config.interval));
        }

    } catch (error) {
        console.log(error)
    }
}

for(const plc of plcs) {
    pollPLC(plc)
}