import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'


const initDB = async () => {
    try {
        const db = await open({
            filename: path.join(process.cwd(), 'src','data','device.db'),
            driver: sqlite3.Database
        }) 
        await db.exec(`
                CREATE TABLE IF NOT EXISTS devices (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    serial_number TEXT NOT NULL UNIQUE,
                    ip_address TEXT NOT NULL UNIQUE,
                    no_gsm TEXT NOT NULL UNIQUE,
                    username TEXT NOT NULL,
                    password TEXT NOT NULL,
                    status INTEGER DEFAULT 0,
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `)
        await db.exec( `
                CREATE TABLE IF NOT EXISTS inboxsms (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    serial_number TEXT NOT NULL,
                    sender TEXT NOT NULL,
                    message TEXT NOT NULL,
                    status TEXT DEFAULT 'unread',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `)
        await db.exec(`
                CREATE TABLE IF NOT EXISTS notifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    serial_number TEXT NOT NULL,
                    type TEXT NOT NULL,
                    message TEXT NOT NULL,
                    status TEXT DEFAULT 'unread',
                    created_at TEXT DEFAULT CURRENT_TIMESTAMP
                )
            `)
        return db
    } catch (error) {
        console.log(error)
    }

}

export default initDB;