import ModbusRTU from "modbus-serial"


const plcs = [
    {name: 'supiturang01', ip: '192.168.0.25', port: 502, unitId: 1, startAddr: 40, qty: 4},
]

export const getAllPlcs = async (req, res) => {
    const result = []
    for(const plc of plcs) {
        const client = new ModbusRTU()
        try {
            await client.connectTCP(plc.ip, {port: plc.port})
            client.setID(plc.unitId)
            client.setTimeout(2000)
            const data = await client.readHoldingRegisters(plc.startAddr, plc.qty)
            console.log(data)
            result.push({
                name: plc.name,
                level: {
                    value: data.data[0] / 100,
                    unit: 'm',
                },
                flow: {
                    value: data.data[3] /100,
                    unit: 'L/s'
                },
                status: 'success',
                timestamp: new Date() 
            })
           
        } catch (err) {
            result.push({
                name: plc.name,
                error: err.message,
                status: 'success'  
            })
        } finally {
            try {
                if(client.isOpen) {
                    if(client._port &&typeof client.close) {
                        
                    }
                }
            } catch (closeErr) {
                console.warn(`⚠️ Error saat menutup koneksi:`, closeErr.message);
            }
        }

    }
    res.status(200).json(result)
}
