import ModbusRTU from "modbus-serial";

const itnerlocks = [
    {
        name: 'supiturang01',
        source: {
            ip: '192.168.0.11',
            port: 502,
            unitId: 1,
            readAddr: 3002,
            qty: 2,
            itnerval: 5500
        },
        targets: [
            {
                name: 'supiturang01',
                ip: '192.168.0.25',
                unitId: 1,
                writeAddr: 43 // 44 -> base on register 0
            },
            {
                name: 'supiturang02',
                ip: '192.168.1.25',
                unitId: 1,
                writeAddr: 47 // 47 -> base on register 0
            }
        ]
    }
]

const bridgePLC = async (config) => {
    const clientSource = new ModbusRTU()
    const clientTarget = config.targets.map(() => new ModbusRTU())

    while(true) {
        try {
            await clientSource.connectTCP(config.source.ip, {port: config.source.port})
            clientSource.setID(config.source.unitId)

            for(let i = 0; i < config.targets.length; i++) {
                const t = config.targets[i]
                await clientTarget[i].connectTCP(t.ip, {port: t.port})
                
            }
        } catch (error) {
            
        }
    }

}