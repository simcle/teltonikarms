export const getDevice = async (db, serial_number) => {
    return await db.get('SELECT * FROM devices WHERE serial_number =?', [serial_number])
}
export const getAllDevices = async (db) => {
    return await db.all('SELECT * FROM devices')
}

export const insertDevice = async (db, device) => {
    
    const { name, serial_number, ip_address, no_gsm, username, password} = device
    return await db.run(
        'INSERT INTO devices (name, serial_number, ip_address, no_gsm, username, password) VALUES(?, ?, ?, ?, ?, ?)',
        [name, serial_number, ip_address, no_gsm, username, password]
    )
}

export const puteDevice = async (db, id, device) => {
    const { name, serial_number, ip_address, no_gsm, username, password} = device
    return await db.run(
        'UPDATE devices SET name = ?, serial_number = ?, ip_address = ?, no_gsm = ?, username = ?, password = ? WHERE id = ?',
        [name, serial_number, ip_address, no_gsm, username, password, id]
    )
}

export const updateDecieStatus = async (db, serial_number, status) => {
    return db.run(
        'UPDATE devices SET status = ? WHERE serial_number = ?',
        [status, serial_number]
    )
}