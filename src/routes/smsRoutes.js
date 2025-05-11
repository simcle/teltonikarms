import express from 'express'
import { listInboxSms, createInboxSms, updatReadInboxSms, getUnreadCount } from '../controllers/inboxsmsController.js'

const router = express.Router()

router.get('/:serial_number', listInboxSms)
router.post('/', createInboxSms)
router.put('/:serial_number', updatReadInboxSms)
router.get('/unread/count', getUnreadCount)

export default router

