import initDB from "../models/databse.js";
import { getInboxSms, insertInboxSms, updateReadSMS, unreadInboxCount } from "../models/inboxsmsModel.js";
import { publish } from "../mqttClient.js";

export const listInboxSms = async (req, res) => {
    try {
        const serial_number = req.params.serial_number
        const db = await initDB()
        const sms = await getInboxSms(db, serial_number)
        await updateReadSMS(db, serial_number)
        res.status(200).json(sms)
    } catch (error) {
        res.status(200).send(error)
    }
}

export const createInboxSms = async (req, res) => {
    try {
        const db = await initDB()
        const result = await insertInboxSms(db, req.body)
        publish('backend/sms', req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const updatReadInboxSms = async (req, res) => {
    try {
        const serial_number = req.params.serial_number
        const db = await initDB()
        await updateReadSMS(db, serial_number)
        res.status(200).json('OK')
    } catch (error) {
        res.status(200).send(error)
    }
}

export const getUnreadCount = async (req, res) => {
    try {
        const db = await initDB()
        const data = await unreadInboxCount(db)
        res.status(200).json(data)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}