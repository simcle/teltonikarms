import express from 'express'
import { listDevices, createDevice, updateDevice } from '../controllers/deviceController.js'

const router = express.Router()
router.get('/', listDevices)
router.post('/', createDevice)
router.put('/:id', updateDevice)

export default router