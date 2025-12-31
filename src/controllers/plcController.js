import dayjs from "dayjs"
import ModbusRTU from "modbus-serial"
import axios from "axios"

const plcs = [
    {name: 'supiturang01', ip: '192.168.0.25', port: 502, unitId: 1, startAddr: 40, qty: 4},
    {name: 'supiturang02', ip: '192.168.1.25', port: 502, unitId: 1, startAddr: 40, qty: 8},
    // {name: 'mulyorejo', ip: '192.168.3.25', port: 502, unitId: 1, startAddr: 40, qty: 4},
]

export const getAllPlcs = async (req, res) => {
    const date = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const result = []
    for(const plc of plcs) {
        const client = new ModbusRTU()
        try {
            await client.connectTCP(plc.ip, {port: plc.port})
            client.setID(plc.unitId)
            client.setTimeout(2000)
            const data = await client.readHoldingRegisters(plc.startAddr, plc.qty)
            if(data.data.length == 4) {
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
                    timestamp: date 
                })
            } else if(data.data.length > 4) {
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
                    flow_out: {
                        value: data.data[7]/100,
                        unit: 'L/s'
                    },
                    status: 'success',
                    timestamp: date 
                })
                sendToThikspeak(data.data[0]/100, data.data[3]/100, data.data[7]/100)
            }
            
           
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

// FUNGSI UNTUK DEBUGIN DATA
const sendToThikspeak = (level, flow, flow_out) => {
    console.log(level)
    axios.get(`https://api.thingspeak.com/update?api_key=M8PFTLR8SEU4UACI&field1=${level}&field2=${flow}&field3=${flow_out}`)
}