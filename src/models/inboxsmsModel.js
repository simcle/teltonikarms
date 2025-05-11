export const getInboxSms = async (db, serial_number) => {
    return await db.all(`SELECT serial_number, sender, message, status, datetime("created_at", "localtime") as created_at FROM inboxsms WHERE serial_number = "${serial_number}" ORDER BY id DESC LIMIT 50`)
}

export const insertInboxSms = async (db, sms) => {
    const { serial_number, sender, message } = sms
    return await db.run(
        'INSERT INTO inboxsms (serial_number, sender, message) VALUES(?, ?, ?)',
        [serial_number, sender, message]
    )
}

export const updateReadSMS = async (db, serial_number) => {
    return await db.run(
        'UPDATE inboxsms SET status = ? WHERE serial_number = ?',
        ['read', serial_number]
    )
}

export const unreadInboxCount = async (db) => {
    return await db.all(
        'SELECT serial_number, COUNT(*) AS sms_unread_count FROM inboxsms WHERE status = "unread" GROUP BY serial_number'
    )
}