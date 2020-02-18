const express = require('express')

const app = express()


app.get('/', function(request, response) {
    response.sendFile(__dirname + '/static/main.html')
})

app.use(express.static('static'))

app.listen(1234, function() {
    console.log('Server started on port 1234')
})