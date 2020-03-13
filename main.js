const PORT = process.env.PORT || 1234


const { Pool } = require('pg')

const pool = new Pool({
    // connectionString: process.env.DATABASE_URL,
    // ssl: true
})


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
    console.log('Serialized:')
    console.log(user)
    done(null, user)
})

passport.deserializeUser((user, done) => {
    console.log('Deserialized:')
    console.log(user)
    done(null, user)
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
        if (
            username == 'luna_koly' &&
            password == 'admin'
        ) {
            console.log('Good')
            return done(null, { username: username, password: password })
        }

        return done(null, false)
    }
))


app.post(
    '/answer',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (request, response) => {
        response.redirect('/answer')
    }
)

app.get('/ask/:username', (request, response) => {
    response.render(__dirname + '/public/ask.html', {
        username: request.params.username
    })
})

app.post('/send-question/:username', (request, response) => {
    console.log('Got: ' + request.body.question)
    response.redirect('/ask/' + request.params.username)
})

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
        response.sendFile(__dirname + '/public/answer.html')
    }
)


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
