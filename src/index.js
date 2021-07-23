const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
//to recieve event we use io.on()
// connection is a built in event
io.on('connection', (socket) => {
    console.log('new socket conection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined')//broadcast is used to send message to others except the user

    socket.on('sendmessage', (message, callback) => {
        io.emit('message', message)
        callback('Delivered!')
    })

    socket.on('sendLocation', (position) => {
        io.emit('message', `https://google.com/maps?q=${position.latitude},${position.longitude}`)
    })
    //disconnect is a buit in event
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!!')
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})