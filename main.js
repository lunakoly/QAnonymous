const express = require('express')
const app = express()

const http = require('http').createServer(app)

const io = require('socket.io')(http)

const PORT = process.env.PORT || 1234


io.on('connection', function(socket) {
    console.log('User connected')
})


app.get('/', function(request, response) {
    response.sendFile(__dirname + '/static/main.html')
})

app.use(express.static('static'))

http.listen(PORT, function() {
    console.log(`Server started on port ${PORT}`)
})