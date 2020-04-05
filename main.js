const PORT = process.env.PORT || 1234


const { Pool } = require('pg')

const pool = new Pool({
    host: process.env.DATABASE_URL,
    // ssl: true,
    database: 'qanonymous',
    user: 'postgres',
    password: '0000'
})


function handleError(error) {
    return console.error(error, error.stack)
}

function findUserByUsername(username) {
    return pool.query(`SELECT * FROM users WHERE username = '${username}' LIMIT 1`)
        .then(result => {
            if (result.rowCount >= 1) {
                return result.rows[0]
            }

            return null
        })
        .catch(handleError)
}

function findUserById(id) {
    return pool.query(`SELECT * FROM users WHERE id = '${id}' LIMIT 1`)
        .then(result => {
            if (result.rowCount >= 1) {
                return result.rows[0]
            }

            return null
        })
        .catch(handleError)
}

function isValidUsername(username) {
    return /^[a-zA-Z0-9_]+$/.test(username)
}

async function userExists(username) {
    if (isValidUsername(username)) {
        return null != await findUserByUsername(username)
    }

    return false
}

function findTopicById(id) {
    return pool.query(`SELECT * FROM topics WHERE id = '${id}' LIMIT 1`)
        .then(result => {
            if (result.rowCount >= 1) {
                return result.rows[0]
            }

            return null
        })
        .catch(handleError)
}


const expressSession = require('express-session')
const bodyParser     = require('body-parser')
const passport       = require('passport')

const LocalStrategy = require('passport-local').Strategy

const mustageExpress = require('mustache-express')

const express = require('express')
const app     = express()


app.engine('html', mustageExpress())

app.set('view engine', 'html')


app.use('/public', express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressSession({
    'secret': 'supercat',
    'resave': false,
    'saveUninitialized': false
}))
app.use(passport.initialize())
app.use(passport.session())


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    findUserById(id).then(user => done(null, user))
})

function checkAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
        return next()
    }

    return response.redirect('/login')
}

function checkNotAuthenticated(request, response, next) {
    if (!request.isAuthenticated()) {
        return next()
    }

    return response.redirect('/answer')
}


passport.use(new LocalStrategy(
    (username, password, done) => {
        // sql injection
        if (!isValidUsername(username)) {
            return done(null, false)
        }

        return findUserByUsername(username)
            .then(user => {
                if (user == null) {
                    return done(null, false)
                }

                if (user.password == password) {
                    return done(null, user)
                }

                return done(null, false)
            })
            .catch(handleError)
    }
))


app.post(
    '/answer',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (request, response) => {
        response.redirect('/answer')
    }
)

app.get('/ask/:username', async (request, response) => {
    if (!isValidUsername(request.params.username)) {
        response.send('No such username found: ' + request.params.username)
        return
    }

    const user = await findUserByUsername(request.params.username)

    if (user == null) {
        response.send('No such username found: ' + request.params.username)
        return
    }

    const command = `SELECT * FROM topics WHERE (target = $1) AND (answer IS NOT NULL);`
    const values = [user.id]

    pool.query(command, values)
        .then(result => {
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

            response.render(__dirname + '/public/ask.html', {
                username: request.params.username,
                result: result
            })
        })
        .catch(handleError)
})

app.post('/send-question/:username', async (request, response) => {
    if (!isValidUsername(request.params.username)) {
        response.send('No such username found: ' + request.params.username)
        return
    }

    const user = await findUserByUsername(request.params.username)

    if (user == null) {
        response.send('No such username found: ' + request.params.username)
        return
    }

    const command = `INSERT INTO topics(target, question) VALUES ($1, $2);`
    const values = [user.id, request.body.question]

    pool.query(command, values)
        .catch(handleError)

    response.redirect('/ask/' + request.params.username)
})

app.post(
    '/send-answer/:id',
    checkAuthenticated,
    async (request, response) => {
        findTopicById(request.params.id)
            .then(topic => {
                if (topic.target != request.user.id) {
                    response.send('You can\'t answer for other people!')
                    return
                }

                const command = `UPDATE topics SET answer = $1 WHERE id = $2;`
                const values = [request.body.answer, topic.id]

                pool.query(command, values)
                    .then(() => response.redirect('/answer'))
                    .catch(handleError)
            })
            .catch(handleError)
    }
)

app.get(
    '/login',
    checkNotAuthenticated,
    (request, response) => {
        response.sendFile(__dirname + '/public/login.html')
    }
)

app.get(
    '/answer',
    checkAuthenticated,
    (request, response) => {
        const command = `SELECT * FROM topics WHERE (target = $1) AND (answer IS NULL);`
        const values = [request.user.id]

        pool.query(command, values)
            .then(result => {
                result.column1 = []
                result.column2 = []
                result.column3 = []

                for (let it = 0; it < result.rowCount; it += 3) {
                    result.column1.push(result.rows[it])
                }

                for (let it = 1; it < result.rowCount; it += 3) {
                    result.column2.push(result.rows[it])
                }

                for (let it = 2; it < result.rowCount; it += 3) {
                    result.column3.push(result.rows[it])
                }

                response.render(__dirname + '/public/answer.html', {
                    result: result
                })
            })
            .catch(handleError)
    }
)

app.get(
    '/pg',
    async (request, response) => {
        try {
            const client = await pool.connect()
            let result = await client.query('SELECT * FROM users')

            let targets = []

            let contents = '<h1>users</h1><table><tr>'

            for (let it of result.fields) {
                targets.push(it.name)
                contents += `<td>${it.name}</td>`
            }

            contents += '</tr>'

            for (let it = 0; it < result.rowCount; it++) {
                contents += '<tr>'

                for (let that of targets) {
                    contents += `<td>${result.rows[it][that]}</td>`
                }

                contents += '</tr>'
            }

            contents += '</table>'

            result = await client.query('SELECT * FROM topics')

            targets = []

            contents += '<h1>topics</h1><table><tr>'

            for (let it of result.fields) {
                targets.push(it.name)
                contents += `<td>${it.name}</td>`
            }

            contents += '</tr>'

            for (let it = 0; it < result.rowCount; it++) {
                contents += '<tr>'

                for (let that of targets) {
                    contents += `<td>${result.rows[it][that]}</td>`
                }

                contents += '</tr>'
            }

            contents += '</table>'

            response.render(__dirname + '/public/pg.html', {
                contents: contents
            })

            client.release()
        } catch (e) {
            console.log(e)
            response.send('Error: ' + e)
        }
    }
)

app.get('/', (request, response) => {
    response.redirect('/login')
})


const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})


// const io = require('socket.io')(server)


// io.on('connection', (socket) => {
//     socket.on('question', function(data) {
//         console.log(`Received: ${data.question}`)
//         socket.emit('question-received')
//     })
// })
