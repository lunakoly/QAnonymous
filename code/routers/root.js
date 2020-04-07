const { asset } = require('../common')

const authentication = require('../authentication')
const constraints = require('../constraints')
const database = require('../database')

const express = require('express')


const root = express.Router()


function parseIntoColumns(result) {
    result.column1 = []
    result.column2 = []
    result.column3 = []

    for (let it = result.rowCount - 1; it >= 0; it -= 3) {
        result.column1.push(result.rows[it])
    }

    for (let it = result.rowCount - 2; it >= 0; it -= 3) {
        result.column2.push(result.rows[it])
    }

    for (let it = result.rowCount - 3; it >= 0; it -= 3) {
        result.column3.push(result.rows[it])
    }

    return result
}


root.get('/', (request, response) => {
    response.sendFile(asset('home.html'))
})

root.get('/login', constraints.requireNotAuthenticated, (request, response) => {
    response.sendFile(asset('login.html'))
})

root.get('/register', constraints.requireNotAuthenticated, (request, response) => {
    response.sendFile(asset('register.html'))
})

root.get('/answer', constraints.requireAuthenticated, (request, response) => {
    const command = `SELECT * FROM topics WHERE (target = $1) AND (answer IS NULL)`

    database.query(command, request.user.id)
        .then(result => {
            response.render(asset('answer.html'), {
                result: parseIntoColumns(result)
            })
        })
})

root.get('/ask', (request, response) => {
    response.sendFile(asset('ask.html'))
})

root.get('/ask/:username',
    constraints.requireValidUsername,
    constraints.requireUserExists,
    (request, response) => {
        const command = `SELECT * FROM topics WHERE (target = $1) AND (answer IS NOT NULL);`

        database.query(command, request.required.user.id)
            .then(result => {
                response.render(asset('ask-username.html'), {
                    username: request.params.username,
                    result: parseIntoColumns(result)
                })
            })
    }
)


root.post('/login',
    constraints.requireValidUsername,
    constraints.requireUserExists,
    authentication.authenticate
)

root.post('/send-question/:username',
    constraints.requireValidUsername,
    constraints.requireUserExists,
    (request, response) => {
        const user = request.required.user
        const command = `INSERT INTO topics(target, question) VALUES ($1, $2);`

        database.query(command, user.id, request.body.question)
            .then(_ => response.redirect('/ask/' + request.params.username))
    }
)

root.post('/send-answer/:id',
    constraints.requireAuthenticated,
    constraints.requireTopicExists,
    (request, response) => {
        const topic = request.required.topic

        if (topic.target != request.user.id) {
            return response.render(asset('error.html'), {
                message: 'You can\'t answer for other people!'
            })
        }

        const command = `UPDATE topics SET answer = $1 WHERE id = $2;`

        database.query(command, request.body.answer, topic.id)
            .then(_ => response.redirect('/answer'))
    }
)


const debugRouter = require('./debug')
root.use('/debug', debugRouter)


module.exports = root