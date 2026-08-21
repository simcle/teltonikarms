import 'dotenv/config'
import { getDB } from '../models/databse.js'
import { createDevicePressure, setDeviceOnline, getPressureStatistics } from '../models/devicePressure.js'
import { getIO } from '../socket.js'

const parseNumber = value => {
    if (value === undefined || value === null || value === '') {
        return null
    }

    const result = Number(value)

    return Number.isFinite(result) ? result : null
}

export const receivePressure = async (req, res) => {
    try {
        const {
            api_key,
            device_id,
            pressure,
            signal,
            battery,
            volt
        } = req.query
        console.log('CP LOGGER',device_id)
        if (api_key !== process.env.API_KEY) {
            return res.status(401).json({
                status: false,
                message: 'API key tidak valid'
            })
        }

        if (!device_id) {
            return res.status(400).json({
                status: false,
                message: 'device_id wajib diisi'
            })
        }

        const pressureValue = parseNumber(pressure)
        const signalValue = parseNumber(signal)
        const batteryValue = parseNumber(battery)
        const voltageValue = parseNumber(volt)

        if (pressureValue === null) {
            return res.status(400).json({
                status: false,
                message: 'pressure tidak valid'
            })
        }

        const db = getDB()

        const device = await db.get(
            `
                SELECT
                    device_id,
                    name,
                    is_active
                FROM deviceloggers
                WHERE device_id = ?
            `,
            device_id
        )

        if (!device) {
            return res.status(404).json({
                status: false,
                message: 'Device logger tidak terdaftar'
            })
        }

        if (device.is_active !== 1) {
            return res.status(403).json({
                status: false,
                message: 'Device logger tidak aktif'
            })
        }

        const data = await createDevicePressure(db, {
            deviceId: device_id,
            pressure: pressureValue,
            voltage: voltageValue,
            battery: batteryValue,
            signal: signalValue,
            recordedAt: new Date().toISOString()
        })

        await setDeviceOnline(db, device_id)

        // =========================================
        // SOCKET.IO REALTIME
        // =========================================

        const io = getIO()
        io.to(`pressure:${device_id}`).emit('pressure:new', {
            ...data,
            name: device.name,
            status: 1
        })
        io.emit('pressure:dashboard', {
            ...data,
            name: device.name,
            status: 1
        })
        
        return res.status(201).send('OK')
    } catch (error) {
        console.error('receivePressure error:', error)

        return res.status(500).json({
            status: false,
            message: 'Gagal menyimpan data pressure',
            error: error.message
        })
    }
}

export const pressureStatistics = async (req, res) => {
    try {
        const {
            mode,
            start,
            end,
            deviceId
        } = req.query

        if (!deviceId) {
            return res.status(400).json({
                status: false,
                message: 'deviceId wajib diisi'
            })
        }

        if (!mode) {
            return res.status(400).json({
                status: false,
                message: 'mode wajib diisi'
            })
        }

        if (!start || !end) {
            return res.status(400).json({
                status: false,
                message: 'start dan end wajib diisi'
            })
        }

        const allowedModes = [
            'real-time',
            '1D',
            '7D',
            '30D'
        ]

        if (!allowedModes.includes(mode)) {
            return res.status(400).json({
                status: false,
                message: 'mode tidak valid'
            })
        }

        let startDate = start
        let endDate = end

        // Untuk mode berdasarkan hari penuh
        if (
            mode === '1D' ||
            mode === '7D' ||
            mode === '30D'
        ) {
            startDate = `${start} 00:00:00`
            endDate = `${end} 23:59:59`
        }

        const db = getDB()

        const data = await getPressureStatistics(db, {
            deviceId,
            start: startDate,
            end: endDate
        })

        return res.status(200).json({
            status: true,
            mode,
            deviceId,
            range: {
                start: startDate,
                end: endDate
            },
            data
        })

    } catch (error) {
        console.error('pressureStatistics error:', error)

        return res.status(500).json({
            status: false,
            message: 'Gagal mengambil data pressure',
            error: error.message
        })
    }
}