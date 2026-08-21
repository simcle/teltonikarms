export const createDevicePressure = async (
    db,
    {
        deviceId,
        pressure,
        voltage,
        battery,
        signal,
        recordedAt
    }
) => {
    const result = await db.run(
        `
            INSERT INTO device_pressures (
                device_id,
                pressure,
                voltage,
                battery,
                signal,
                recorded_at
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `,
        deviceId,
        pressure,
        voltage,
        battery,
        signal,
        recordedAt
    )

    return {
        id: result.lastID,
        device_id: deviceId,
        pressure,
        voltage,
        battery,
        signal,
        recorded_at: recordedAt
    }
}

export const setDeviceOnline = async (db, deviceId) => {
    return await db.run(
        `
            UPDATE deviceloggers
            SET
                status = 1,
                updated_at = CURRENT_TIMESTAMP
            WHERE device_id = ?
        `,
        deviceId
    )
}

export const getPressureStatistics = async (
    db,
    {
        deviceId,
        start,
        end
    }
) => {
    return await db.all(
        `
            SELECT
                id,
                device_id,
                pressure,
                voltage,
                battery,
                signal,
                recorded_at,
                received_at

            FROM device_pressures

            WHERE
                device_id = ?
                AND recorded_at >= ?
                AND recorded_at <= ?

            ORDER BY recorded_at ASC, id ASC
        `,
        deviceId,
        start,
        end
    )
}

