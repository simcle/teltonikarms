export const getDeviceLogger = async (db, device_id) => {
    return await db.get(
        `
            SELECT
                'Logger Tekanan' AS type,

                d.id,
                d.device_id,
                d.name,
                d.is_active,
                d.status,
                d.latitude,
                d.longitude,
                d.created_at,
                d.updated_at,

                p.pressure,
                p.voltage,
                p.battery,
                p.signal,
                p.recorded_at,
                p.received_at

            FROM deviceloggers d

            LEFT JOIN device_pressures p
                ON p.id = (
                    SELECT dp.id
                    FROM device_pressures dp
                    WHERE dp.device_id = d.device_id
                    ORDER BY dp.recorded_at DESC, dp.id DESC
                    LIMIT 1
                )

            WHERE d.device_id = ?
        `,
        [device_id]
    )
}

export const getAllDeviceLogger = async (
    db,
    {
        search = '',
        page = 1,
        limit = 10
    } = {}
) => {
    page = Math.max(Number(page) || 1, 1)
    limit = Math.min(Math.max(Number(limit) || 10, 1), 100)

    const offset = (page - 1) * limit
    const cleanSearch = search.trim()
    const keyword = `%${cleanSearch}%`

    const whereClause = cleanSearch
        ? `
            WHERE (
                d.device_id LIKE ? COLLATE NOCASE
                OR d.name LIKE ? COLLATE NOCASE
            )
        `
        : ''

    const searchParams = cleanSearch
        ? [keyword, keyword]
        : []

    const [devices, countResult] = await Promise.all([
        db.all(
            `
                SELECT
                    d.id,
                    d.device_id,
                    d.name,
                    d.is_active,
                    d.status,
                    d.latitude,
                    d.longitude,
                    d.created_at,

                    p.pressure,
                    p.voltage,
                    p.battery,
                    p.signal,
                    p.recorded_at,
                    p.received_at

                FROM deviceloggers d

                LEFT JOIN device_pressures p
                    ON p.id = (
                        SELECT dp.id
                        FROM device_pressures dp
                        WHERE dp.device_id = d.device_id
                        ORDER BY dp.recorded_at DESC, dp.id DESC
                        LIMIT 1
                    )

                ${whereClause}

                ORDER BY d.device_id ASC, d.id DESC
                LIMIT ? OFFSET ?
            `,
            ...searchParams,
            limit,
            offset
        ),

        db.get(
            `
                SELECT COUNT(*) AS total
                FROM deviceloggers d
                ${whereClause}
            `,
            ...searchParams
        )
    ])

    const total = Number(countResult?.total || 0)
    const totalPages = Math.ceil(total / limit)

    return {
        data: devices,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    }
}

export const insertDevice = async (db, device) => {
    const { device_id, name, latitude, longitude} = device
    return await db.run(
        'INSERT INTO deviceloggers (device_id, name, latitude, longitude) VALUES(?, ?, ?, ?)',
        [device_id, name, latitude, longitude]
    )
}

export const putDevice = async (db, id, device) => {
    const { device_id, name, latitude, longitude} = device
    return await db.run(
        'UPDATE deviceloggers SET device_id=?, name=?, latitude=?, longitude=? WHERE id=?',
        [device_id, name, latitude, longitude, id]
    )
}
export const deleteDeviceLogger = async (db, id) => {
    return await db.run(
        `
            DELETE FROM deviceloggers
            WHERE id = ?
        `,
        [id]
    )
}

export const updateOfflineDevices = async (db) => {
    const devices = await db.all(`
        SELECT
            d.device_id,
            d.name
        FROM deviceloggers d

        LEFT JOIN device_pressures p
            ON p.id = (
                SELECT dp.id
                FROM device_pressures dp
                WHERE dp.device_id = d.device_id
                ORDER BY dp.recorded_at DESC, dp.id DESC
                LIMIT 1
            )

        WHERE
            d.status = 1
            AND (
                p.recorded_at IS NULL
                OR datetime(p.recorded_at) < datetime('now', '-1 hour')
            )
    `)

    if (devices.length === 0) {
        return []
    }

    await db.run(`
        UPDATE deviceloggers
        SET
            status = 0,
            updated_at = CURRENT_TIMESTAMP
        WHERE status = 1
        AND device_id IN (
            SELECT d.device_id
            FROM deviceloggers d

            LEFT JOIN device_pressures p
                ON p.id = (
                    SELECT dp.id
                    FROM device_pressures dp
                    WHERE dp.device_id = d.device_id
                    ORDER BY dp.recorded_at DESC, dp.id DESC
                    LIMIT 1
                )

            WHERE
                p.recorded_at IS NULL
                OR datetime(p.recorded_at) < datetime('now', '-1 hour')
        )
    `)

    return devices
}

export const getAllDeviceLoggerMap = async (db) => {
    const [data, summary] = await Promise.all([
        db.all(`
            SELECT
                'Logger Tekanan' AS type,
                d.id,
                d.device_id,
                d.name,
                d.is_active,
                d.status,
                d.latitude,
                d.longitude,

                p.pressure,
                p.voltage,
                p.battery,
                p.signal,
                p.recorded_at,
                p.received_at

            FROM deviceloggers d

            LEFT JOIN device_pressures p
                ON p.id = (
                    SELECT dp.id
                    FROM device_pressures dp
                    WHERE dp.device_id = d.device_id
                    ORDER BY dp.recorded_at DESC, dp.id DESC
                    LIMIT 1
                )

            WHERE
                d.latitude IS NOT NULL
                AND d.longitude IS NOT NULL

            ORDER BY d.name ASC
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

            FROM deviceloggers
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