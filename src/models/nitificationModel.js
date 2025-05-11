export const getNotifications = async (db, serial_number) => {
    return await db.all(`SELECT serial_number, type, message, status, datetime("created_at","localtime") as created_at FROM notifications WHERE serial_number = "${serial_number}" ORDER BY id DESC LIMIT 50`)
}

export const insertNotification = async (db, payload) => {
    const { serial_number, type, message } = payload
    return await db.run(
        `INSERT INTO notifications (serial_number, type, message) VALUES(?, ?, ?)`,
        [serial_number, type, message]
    )
}

export const updateReadNotifications = async (db, serial_number) => {
    return await db.run(
        `UPDATE notifications SET status = ? WHERE serial_number = ?`,
        ['read', serial_number]
    )
}

export const unreadNotificationCount = async (db) => {
    return await db.all(
        `SELECT serial_number, COUNT(*) AS notification_unread_count FROM notifications WHERE status = "unread" GROUP BY serial_number`
    )
}