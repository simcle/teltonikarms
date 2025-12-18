import initDB from "../models/databse.js";
import { getAllDevices, insertDevice, puteDevice} from "../models/deviceModel.js";
import { checkPlcConnection } from "../utils/pingHelper.js";

export const listDevices = async (req, res) => {
    try {
        const db = await initDB()
        const devices = await getAllDevices(db)
        checkPlcConnection()
        res.status(200).json(devices)
    } catch (error) {
        res.status(400).send(error)
    }
}
export const createDevice = async (req, res) => {
    try {
        const db = await initDB()
        const result = await insertDevice(db, req.body)
        res.status(200).json({id: result.lastID})
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            const message = error.message;
        
            if (message.includes('serial_number')) {
              return res.status(409).json({ serial_number: 'Duplicate serial_number' });
            } else if (message.includes('ip_address')) {
              return res.status(409).json({ ip_address: 'Duplicate ip_address' });
            } else if (message.includes('no_gsm')) {
              return res.status(409).json({ no_gsm: 'Duplicate no_gsm' });
            } else {
              return res.status(409).json({ error: 'Duplicate entry' });
            }
          }
        res.status(400).send(error)
    }
}

export const updateDevice = async (req, res) => {

    try {

        const db = await initDB()
        const id = req.params.id 
        const device = req.body
        
        await puteDevice(db, id, device)
        res.status(200).json('OK')
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
          const message = error.message;
      
          if (message.includes('serial_number')) {
            return res.status(409).json({ serial_number: 'Duplicate serial_number' });
          } else if (message.includes('ip_address')) {
            return res.status(409).json({ ip_address: 'Duplicate ip_address' });
          } else if (message.includes('no_gsm')) {
            return res.status(409).json({ no_gsm: 'Duplicate no_gsm' });
          } else {
            return res.status(409).json({ error: 'Duplicate entry' });
          }
        }
      res.status(400).send(error)
    }
}