import {getDB} from "../models/databse.js";

import { getDeviceLogger, getAllDeviceLogger, insertDevice, putDevice, deleteDeviceLogger, getAllDeviceLoggerMap } from "../models/deviceLogger.js";

export const getDeviceById = async (req, res) => {
    try {
        const { id } = req.params
        const db = getDB()
        const result = await getDeviceLogger(db, id)
        return res.status(200).json(result)
    } catch (error) {
        res.status(400).send(error)   
    }
}

export const listDeviceMap = async (req, res) => {
    try {
        const db = getDB()
        const result = await getAllDeviceLoggerMap(db)
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const listDevices = async (req, res) => {
    try {
        const db = getDB()
        const result = await getAllDeviceLogger(db, {
            search: req.query.search || '',
            page: req.query.page || 1,
            limit: req.query.limit || 10
        })
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send(error)
    }
} 

export const createDevice = async (req, res) => {
    try {
        
        const db = getDB()
        const result = await insertDevice(db, req.body)
        res.status(200).json({id: result.lastID})

    } catch (error) {
        if(error.code === 'SQLITE_CONSTRAINT') {
            const message = error.message
            console.log(message)
            if(message.includes('device_id')) {
                return res.status(409).json({ device_id: 'Duplicate device id' });
            }
        }
        res.status(400).send(error)
    }
}

export const updateDevice = async (req, res) => {
    try {
        const db = getDB()
        const id = req.params.id
        const device = req.body
        await putDevice(db, id, device)
        res.status(200).json('OK')
    } catch (error) {
        console.log(error)
        if(error.code === 'SQLITE_CONSTRAINT') {
            const message = error.message
            console.log(message)
            if(message.includes('device_id')) {
                return res.status(409).json({ device_id: 'Duplicate device id' });
            }
        }
        res.status(400).send(error)
    }
}


export const removeDeviceLogger = async (req, res) => {
    try {
        const { id } = req.params

        const db = getDB()

        const result = await deleteDeviceLogger(
            db,
            id
        )

        if (!result) {
            return res.status(404).json({
                status: false,
                message: 'Device logger tidak ditemukan'
            })
        }

        return res.status(200).json({
            status: true,
            message: 'Device logger berhasil dihapus',
            data: result
        })

    } catch (error) {
        console.error(
            'removeDeviceLogger error:',
            error
        )

        return res.status(500).json({
            status: false,
            message: 'Gagal menghapus device logger',
            error: error.message
        })
    }
}