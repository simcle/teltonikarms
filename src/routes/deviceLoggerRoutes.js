import express from 'express'
import {getDeviceById, listDeviceMap, listDevices, createDevice, updateDevice, removeDeviceLogger } from '../controllers/deviceLoggerController.js'

const router = express.Router()
router.put('/:id', updateDevice)
router.delete('/:id', removeDeviceLogger)
router.get('/', listDevices)
router.get('/map', listDeviceMap)
router.get('/:id/detail', getDeviceById)
router.post('/', createDevice)

export default router
