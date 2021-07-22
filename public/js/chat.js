const socket = io()

//to recieve event
socket.on('countUpdated', (count) => {
    console.log('the count is updated')
    console.log(count)
})

document.querySelector('#increment').addEventListener('click', () => {
    console.log('clicked')
    socket.emit('increment')
})