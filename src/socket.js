let ioInstance = null

export const initSocket = (io) => {
    ioInstance = io

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id)

        socket.on('pressure:join', (deviceId) => {
            if (!deviceId) return

            const room = `pressure:${deviceId}`

            socket.join(room)

            console.log(`${socket.id} join ${room}`)
        })

        socket.on('pressure:leave', (deviceId) => {
            if (!deviceId) return

            socket.leave(`pressure:${deviceId}`)
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id)
        })
    })
}

export const getIO = () => {
    if (!ioInstance) {
        throw new Error('Socket.IO belum diinisialisasi')
    }

    return ioInstance
}