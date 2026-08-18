

export const getDevice = async (db, deviceId) => {
    return await db.get('SELECT * FROM devices WHERE id =?', [deviceId])
}
export const getAllDevices = async (db) => {
    return await db.all('SELECT * FROM devices')
}

export const insertDevice = async (db, device) => {
    
    const { name, serial_number, ip_address, no_gsm, latitude, longitude, username, password} = device
    return await db.run(
        'INSERT INTO devices (name, serial_number, ip_address, no_gsm, latitude, longitude, username, password) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
        [name, serial_number, ip_address, no_gsm, latitude, longitude, username, password]
    )
}

export const puteDevice = async (db, id, device) => {
    const { name, serial_number, ip_address, no_gsm, latitude, longitude, username, password} = device
    return await db.run(
        'UPDATE devices SET name = ?, serial_number = ?, ip_address = ?, no_gsm = ?, latitude = ?, longitude = ?, username = ?, password = ? WHERE id = ?',
        [name, serial_number, ip_address, no_gsm, latitude, longitude, username, password, id]
    )
}

export const updateDecieStatus = async (db, serial_number, status) => {
    return db.run(
        'UPDATE devices SET status = ? WHERE serial_number = ?',
        [status, serial_number]
    )
}

export const getAllDeviceMap = async (db) => {
    const [data, summary] = await Promise.all([
        db.all(`
            SELECT
                id,
                'PLC RTU' AS type,

                name,
                serial_number,
                ip_address,
                no_gsm,
                status,
                latitude,
                longitude,
                created_at

            FROM devices

            WHERE
                latitude IS NOT NULL
                AND longitude IS NOT NULL

            ORDER BY name ASC
        `),

        db.get(`
            SELECT
                COUNT(*) AS total_device,

                SUM(
                    CASE
                        WHEN status = 1 THEN 1
                        ELSE 0
                    END
                ) AS total_online,

                SUM(
                    CASE
                        WHEN status = 0 THEN 1
                        ELSE 0
                    END
                ) AS total_offline

            FROM devices
        `)
    ])

    return {
        summary: {
            totalDevice: Number(summary?.total_device || 0),
            totalOnline: Number(summary?.total_online || 0),
            totalOffline: Number(summary?.total_offline || 0)
        },
        data
    }
}