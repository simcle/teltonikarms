import express from 'express'
import { checkQuota, getMobileUsage } from '../controllers/serviceController.js'

const router = express.Router()

router.get('/:serial_number', getMobileUsage)
router.post('/check-quota', checkQuota)
export default router