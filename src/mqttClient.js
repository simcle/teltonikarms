import mqtt from "mqtt";
import dayjs from "dayjs";
import initDB from "./models/databse.js";
import { getDevice, updateDecieStatus } from "./models/deviceModel.js";
import { insertNotification } from "./models/nitificationModel.js";

const devices = []

let client = null

export const connectMqtt = (brokerUrl = 'mqtt://localhost:1883', options = {}) => {
    client = mqtt.connect(brokerUrl, {
      clientId: 'mqtt_server_' + Math.random().toString(16).slice(2, 8),
      reconnectPeriod: 3000,
      ...options
    })
  
    client.on('connect', () => {
        console.log('[MQTT] Connected')
    })
  
    client.on('reconnect', () => {
        console.log('[MQTT] Reconnecting...')
    })
  
    client.on('error', (err) => {
        console.error('[MQTT] Error:', err.message)
    })
  
    client.on('close', () => {
        console.warn('[MQTT] Disconnected')
    })
  
    client.on('message', (topic, message) => {
        const now = new Date().toISOString()
        const serial_number = topic.split('/')[1]
        const index = devices.findIndex(d => d.serial_number == serial_number)
        if(index === -1) {
            devices.push({serial_number: serial_number, last_seen: now})
        } else {
            devices[index].last_seen = now
        }
    })
}

export const subscribe = (topic) => {
    if (!client) return console.warn('[MQTT] Not connected')
    client.subscribe(topic, (err) => {
        if (err) console.error('[MQTT] Subscribe error:', err.message)
        else console.log(`[MQTT] Subscribed to ${topic}`)
    })
}
  
export const publish = (topic, message) => {
    if (!client) return console.warn('[MQTT] Not connected')
    client.publish(topic, typeof message === 'string' ? message : JSON.stringify(message))
}


const devicesUpdate = async () => {
    const now = dayjs()
    const db = await initDB()
    for(let i = 0; i < devices.length; i++) {
        const device = devices[i]
        const serial_number = device.serial_number
        const lastSeen = dayjs(device.last_seen)
        const diffSecond = now.diff(lastSeen, 'second')
        const isOnline = diffSecond <= 10
        const status = isOnline ? 1:0
        const res = await getDevice(db, serial_number)
        if(res) {
            const onlineMessage = 'Perangkat telah online dan terhubung ke server.'
            const offlineMessage = 'Perangkat tidak terhubung (OFFLINE) Kemungkinan gangguan jaringan, power supply, atau restart tidak normal.'
            if(status !== res.status) {
                const payload = {
                    serial_number: serial_number,
                    type: status ? 'DEVICE ONLINE': 'DEVICE OFFLINE',
                    message: status ? onlineMessage : offlineMessage,
                    created_at: new Date().toISOString()
                }
                await insertNotification(db, payload)
                await updateDecieStatus(db, serial_number, status)
                publish('backend/notif', payload)
            }
        }
        publish('backend/status', {serial_number: serial_number, status: status})
    }
}

setInterval(() => {
    devicesUpdate()
}, 60000)