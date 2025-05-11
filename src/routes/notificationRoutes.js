import express from 'express'
import { listNotifications, creatNotifiaction, updateRead, getCountUnread } from '../controllers/notificationController.js'

const router = express.Router()

router.get('/:serial_number', listNotifications)
router.post('/', creatNotifiaction)
router.put('/:serial_number', updateRead)
router.get('/unread/count', getCountUnread)

export default router