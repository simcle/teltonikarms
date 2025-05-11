import initDB from "../models/databse.js";
import { getNotifications, insertNotification, updateReadNotifications, unreadNotificationCount } from "../models/nitificationModel.js";
import { publish } from "../mqttClient.js";

export const listNotifications = async (req, res) => {
    try {
        const serial_number = req.params.serial_number
        const db = await initDB()
        const notifications = await getNotifications(db, serial_number)
        await updateReadNotifications(db, serial_number)
        res.status(200).json(notifications)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}

export const creatNotifiaction = async (req, res) => {
    try {
        console.log(req.body)
        const db = await initDB()
        const result = await insertNotification(db, req.body)
        publish('backend/notif', req.body)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const updateRead = async (req, res) => {
    try {
        const serial_number = req.params.serial_number
        const db = await initDB()
        const result = await updateReadNotifications(db, serial_number)
        res.status(200).json(result)
    } catch (error) {
        res.status(400).send(error)
    }
}

export const getCountUnread = async (req, res) => {
    try {
        const db = await initDB()
        const result = await unreadNotificationCount(db)
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
        res.status(400).send(error)
    }
}