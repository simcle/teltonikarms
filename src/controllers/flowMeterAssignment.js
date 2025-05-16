import ModbusRTU from "modbus-serial"

const plcA = {
  name: "PLC_A",
  ip: "192.168.0.11",
  port: 502,
  unitId: 1,
  readAddr: 3002,
  qty: 2
}

const plcB = {
  name: "PLC_B",
  ip: "192.168.0.25",
  port: 502,
  unitId: 1,
  writeAddr: 43
}

const pollingInterval = 5000
const reconnectDelay = 5000

class PLCClient {
  constructor(name, ip, port, unitId) {
    this.name = name
    this.ip = ip
    this.port = port
    this.unitId = unitId
    this.client = new ModbusRTU()
    this.connected = false
    this.connecting = false // guard agar tidak double connect
  }

  async connect() {
    if (this.connected || this.connecting) return
    this.connecting = true
    try {
      await this.client.connectTCP(this.ip, { port: this.port })
      this.client.setID(this.unitId)
      this.client.setTimeout(2000)
      this.connected = true
      console.log(`[${this.name}] Connected to ${this.ip}:${this.port}`)
    } catch (err) {
      console.error(`[${this.name}] Connect error:`, err.message)
      setTimeout(() => this.connect(), reconnectDelay)
    } finally {
      this.connecting = false
    }
  }

  async read(addr, qty) {
    if (!this.connected) return null
    try {
      const res = await this.client.readHoldingRegisters(addr, qty)
      const floatValue = res.buffer.readFloatBE(0).toFixed(2)
      const parserToFloat = parseFloat(floatValue)
      const sacledValue = Math.round(parserToFloat * 100)
      return sacledValue
    } catch (err) {
      console.error(`[${this.name}] Read error:`, err.message)
      this._handleDisconnect()
      return null
    }
  }

  async write(addr, values) {
    if (!this.connected) return false
    try {
      await this.client.writeRegister(addr, values)
      return true
    } catch (err) {
      console.error(`[${this.name}] Write error:`, err.message)
      this._handleDisconnect()
      return false
    }
  }

  _handleDisconnect() {
    this.connected = false
    try {
      this.client.close()
    } catch (_) {}
    setTimeout(() => this.connect(), reconnectDelay)
  }
}

// Inisialisasi 2 client
const clientA = new PLCClient(plcA.name, plcA.ip, plcA.port, plcA.unitId)
const clientB = new PLCClient(plcB.name, plcB.ip, plcB.port, plcB.unitId)

// Start koneksi awal
clientA.connect()
clientB.connect()

// Loop Assignment
setInterval(async () => {
  const data = await clientA.read(plcA.readAddr, plcA.qty)
  if (!data) return
  console.log(data)

  const success = await clientB.write(plcB.writeAddr, data)
  if (success) {
    console.log(`[INFO] Transfer dari ${plcA.name} ke ${plcB.name}:`, data)
  }
}, pollingInterval)