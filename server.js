import express from 'express'
import cors from 'cors'

import deviceRouter from './src/routes/deviceRoutes.js'
import smsRouter from './src/routes/smsRoutes.js'
import notificationRouter from './src/routes/notificationRoutes.js'
import serviceRouter from './src/routes/serviceRouter.js'
import plcRouter from './src/routes/plcRoutes.js'

import path from 'path'
import { fileURLToPath } from 'url'

import { connectMqtt, subscribe, publish } from './src/mqttClient.js'

connectMqtt('mqtt://10.10.40.19:1883')
subscribe('device/+')
import './src/controllers/flowMeterAssignment.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())

app.use(express.static(path.join(__dirname, 'public')))


app.use(express.urlencoded({extended: true}))
app.use(express.json())


app.use('/api/devices', deviceRouter)
app.use('/api/sms', smsRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/mobile-usage', serviceRouter)
app.use('/api/plc', plcRouter)

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')) // ganti 'public' kalau pakai 'dist'
})

const PORT = 3000 
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})