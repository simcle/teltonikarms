import cron from 'node-cron'
import { getDB } from '../models/databse.js'
import { updateOfflineDevices } from '../models/deviceLogger.js'
import { getIO } from '../socket.js'

export const startDeviceStatusScheduler = () => {
    cron.schedule('*/5 * * * *', async () => {
        try {
            const db = getDB()

            const offlineDevices =
                await updateOfflineDevices(db)

            if (offlineDevices.length === 0) {
                return
            }

            const io = getIO()

            for (const device of offlineDevices) {
                const realtimeData = {
                    device_id: device.device_id,
                    name: device.name,
                    type: 'Logger Tekanan',
                    status: 0
                }

                // Detail device
                io.to(
                    `pressure:${device.device_id}`
                ).emit(
                    'pressure:status',
                    realtimeData
                )

                // Dashboard map
                io.emit(
                    'pressure:status:dashboard',
                    realtimeData
                )
            }

            console.log(
                `${offlineDevices.length} device berubah menjadi OFFLINE`
            )

        } catch (error) {
            console.error(
                'Device status scheduler error:',
                error
            )
        }
    })
}