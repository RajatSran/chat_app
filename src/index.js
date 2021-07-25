const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')

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
    socket.emit('message',generateMessage('Welcome!'))

    socket.broadcast.emit('message', generateMessage('A new user has joined'))//broadcast is used to send message to others except the user

    socket.on('sendmessage', (message, callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            message = filter.clean(message)
        }
        io.emit('message', generateMessage(message))
        callback('Delivered!')
    })

    socket.on('sendLocation', (position,callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${position.latitude},${position.longitude}`)
        callback()
    })

    //disconnect is a buit in event
    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!!'))
    })

})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})