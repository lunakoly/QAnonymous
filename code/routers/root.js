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
    response.render(asset('home.html'), {
        loggedIn: request.isAuthenticated()
    })
})

root.get('/login', constraints.requireNotAuthenticated, (request, response) => {
    response.sendFile(asset('login.html'))
})

root.get('/logout', authentication.logOut)

root.get('/register', constraints.requireNotAuthenticated, (request, response) => {
    response.sendFile(asset('register.html'))
})

root.get('/settings', constraints.requireAuthenticated, (request, response) => {
    response.render(asset('settings.html'), {
        username: request.user.username,
        email: request.user.email,
    })
})

root.get('/answer', constraints.requireAuthenticated, (request, response) => {
    const command = `SELECT * FROM topics WHERE (target = $1) AND (answer IS NULL)`

    database.query(command, request.user.id)
        .then(result => {
            response.render(asset('answer.html'), {
                result: parseIntoColumns(result),
                loggedIn: request.isAuthenticated(),
            })
        })
})

root.get('/ask', (request, response) => {
    response.render(asset('ask.html'), {
        loggedIn: request.isAuthenticated()
    })
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
                    result: parseIntoColumns(result),
                    loggedIn: request.isAuthenticated(),
                })
            })
    }
)


root.post('/login',
    constraints.requireValidUsername,
    constraints.requireUserExists,
    constraints.requireValidPassword,
    authentication.authenticate
)

root.post('/register',
    constraints.requireValidUsername,
    constraints.requireUserNotExists,
    constraints.requireValidPassword,
    constraints.requireValidEmail,
    authentication.register
)

root.post('/send-question/:username',
    constraints.requireValidUsername,
    constraints.requireUserExists,
    constraints.requireValidQuestion,
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
    constraints.requireValidAnswer,
    (request, response) => {
        const topic = request.required.topic

        if (topic.target != request.user.id) {
            return response.render(asset('error.html'), {
                message: 'You can\'t answer for other people!',
                loggedIn: request.isAuthenticated(),
            })
        }

        const command = `UPDATE topics SET answer = $1 WHERE id = $2;`

        database.query(command, request.body.answer, topic.id)
            .then(_ => response.redirect('/answer'))
    }
)

root.post('/update-info',
    constraints.requireAuthenticated,
    constraints.requireValidUsername,
    constraints.requireValidEmail,
    constraints.requireUserNotExists,
    (request, response) => {
        const command = `UPDATE users SET username = $1, email = $2  WHERE id = $3;`

        database.query(command, request.body.username, request.body.email, request.user.id)
            .then(_ => response.redirect('/settings'))
    }
)

root.post('/update-password',
    constraints.requireAuthenticated,
    constraints.requireCurrentPasswordMatch,
    constraints.requireValidPassword,
    (request, response) => {
        const command = `UPDATE users SET password = crypt($1, gen_salt('bf')) WHERE id = $2;`

        database.query(command, request.body.password, request.user.id)
            .then(_ => response.redirect('/settings'))
    }
)


const debugRouter = require('./debug')
root.use('/debug', debugRouter)


root.use('*', (request, response) => {
    return response.render(asset('error.html'), {
        message: `Invalid URL`,
        loggedIn: request.isAuthenticated()
    })
})


module.exports = root