import express from 'express'
import { listDevices, createDevice, updateDevice, listDeviceMap } from '../controllers/deviceController.js'

const router = express.Router()
router.get('/', listDevices)
router.post('/', createDevice)
router.put('/:id', updateDevice)
router.get('/map', listDeviceMap)
export default router