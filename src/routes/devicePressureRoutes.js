import express from 'express'
import { pressureStatistics, receivePressure } from '../controllers/devicePressureController.js'

const router = express.Router()

router.get('/', receivePressure)
router.get('/statistics', pressureStatistics)
export default router