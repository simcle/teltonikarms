import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'path'

let dbInstance = null

const initDB = async () => {
    if (dbInstance) {
        return dbInstance
    }

    try {
        dbInstance = await open({
            filename: path.join(
                process.cwd(),
                'src',
                'data',
                'device.db'
            ),
            driver: sqlite3.Database
        })

        /*
         * Konfigurasi SQLite
         */
        await dbInstance.exec(`
            PRAGMA journal_mode = WAL;
            PRAGMA synchronous = NORMAL;
            PRAGMA foreign_keys = ON;
            PRAGMA busy_timeout = 5000;
        `)

        /*
         * Device jaringan / gateway
         */
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS devices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                serial_number TEXT NOT NULL UNIQUE,
                ip_address TEXT NOT NULL UNIQUE,
                no_gsm TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL,
                password TEXT NOT NULL,
                status INTEGER NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `)
        const columns = await dbInstance.all(`
            PRAGMA table_info(devices)
        `)

        if (!columns.find(c => c.name === 'latitude')) {
            await dbInstance.exec(`
                ALTER TABLE devices
                ADD COLUMN latitude REAL
            `)
        }

        if (!columns.find(c => c.name === 'longitude')) {
            await dbInstance.exec(`
                ALTER TABLE devices
                ADD COLUMN longitude REAL
            `)
        }

        /*
         * SMS masuk
         */
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS inboxsms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                serial_number TEXT NOT NULL,
                sender TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'unread',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `)

        /*
         * Notifikasi
         */
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                serial_number TEXT NOT NULL,
                type TEXT NOT NULL,
                message TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'unread',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `)

        /*
         * Master data logger
         */
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS deviceloggers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                device_id TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                status INTEGER NOT NULL DEFAULT 1,
                latitude REAL,
                longitude REAL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
        `)

        /*
         * Histori data telemetry
         */
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS device_pressures (
                id INTEGER PRIMARY KEY AUTOINCREMENT,

                device_id TEXT NOT NULL,

                pressure REAL,
                voltage REAL,
                battery REAL,
                signal INTEGER,

                recorded_at TEXT NOT NULL,
                received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (device_id)
                    REFERENCES deviceloggers(device_id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE,

                UNIQUE(device_id, recorded_at)
            )
        `)

        /*
         * Data telemetry terakhir setiap logger
         */
        await dbInstance.exec(`
            CREATE TABLE IF NOT EXISTS device_latest_pressures (
                device_id TEXT PRIMARY KEY,

                pressure REAL,
                voltage REAL,
                battery REAL,
                signal INTEGER,

                recorded_at TEXT NOT NULL,
                received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (device_id)
                    REFERENCES deviceloggers(device_id)
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            )
        `)

        /*
         * Index histori telemetry
         */
        await dbInstance.exec(`
            CREATE INDEX IF NOT EXISTS idx_device_pressures_device_recorded
            ON device_pressures(device_id, recorded_at DESC)    
        `)

        await dbInstance.exec(`
            CREATE INDEX IF NOT EXISTS idx_device_pressures_recorded
            ON device_pressures(recorded_at DESC)
        `)

        await dbInstance.exec(`
            CREATE INDEX IF NOT EXISTS idx_deviceloggers_name
            ON deviceloggers(name COLLATE NOCASE)
        `)

        console.log('SQLite database initialized')

        return dbInstance
    } catch (error) {
        dbInstance = null

        console.error('Failed to initialize SQLite database:', error)

        throw error
    }
}

export const getDB = () => {
    if (!dbInstance) {
        throw new Error(
            'Database belum diinisialisasi. Jalankan initDB() terlebih dahulu.'
        )
    }

    return dbInstance
}

export const closeDB = async () => {
    if (!dbInstance) {
        return
    }

    await dbInstance.close()
    dbInstance = null
}

export default initDB