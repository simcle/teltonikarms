import initDB from "../models/databse.js";
import { getDevice } from "../models/deviceModel.js";
import axios from "axios";

export const getMobileUsage = async (req, res) => {
    try {
        const interval = req.query.interval
        const serial_number = req.params.serial_number
        const db = await initDB()
        const result = await getDevice(db, serial_number)
        if(result) {
            const {username, password, ip_address} = result
            const url = `http://${ip_address}/api`
            const autLogin = {username: username, password:password}
            const {data} = await axios.post(`${url}/login`, autLogin, {timeout: 5000})
            const token = data.data.token
            const dataUsage = await axios.get(`${url}/data_usage/${interval}/status`, {
                timeout: 5000,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            res.status(200).json(dataUsage.data.data)
        }
    } catch (error) {
        res.status(400).send(error)
    }
}

export const checkQuota = async (req, res) => {
    
    try {
        const {username, password, ip_address} = req.body
        const url = `http://${ip_address}/api`
        const autLogin = {username: username, password: password}
        const { data } = await axios.post(`${url}/login`, autLogin, {timeout: 5000})
        const token = data.data.token
        await axios.post(`${url}/messages/actions/send`, {
            data: {
                number: '3636',
                message: 'UL INFO',
                modem: '1-1.4'
            }
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        res.status(200).json('Permintaan anda sedang diproses...')

    } catch (error) {
        res.status(400).send(error)
    }
}