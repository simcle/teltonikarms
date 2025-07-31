import ping from 'ping'
import { publish } from '../mqttClient.js';
console.log('start ping')
const plcIps = [
    {deviceIp: '192.168.0.11', plcIp: '192.168.0.25'},
    {deviceIp: '192.168.1.11', plcIp: '192.168.1.25'},
]

const plcStatus = new Map()

async function checkPlcConnection(plcIps) {
    const results = await Promise.all(
        plcIps.map(async (plc) => {
            const resDevice = await ping.promise.probe(plc.deviceIp, { timeout: 2 });
            const resPlc = await ping.promise.probe(plc.plcIp, { timeout: 2 });

            return {
                deviceIp: plc.deviceIp,
                deviceAlive: resDevice.alive,
                plcIp: plc.plcIp,
                plcAlive: resPlc.alive,
                time: new Date().toISOString()
            };
        })
    );

    publish('backend/plc/status', results)
}

checkPlcConnection(plcIps);

setInterval(() => {
    checkPlcConnection(plcIps);
}, 60000);