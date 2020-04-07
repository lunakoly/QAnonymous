const database = require('./database')

const passport = require('passport')


const localStrategy = require('./local-strategy')
passport.use(localStrategy)


function configure(app) {
    app.use(passport.initialize())
    app.use(passport.session())
}

function authenticate(request, response, next) {
    passport.authenticate('local', (error, user, info) => {
        if (error) {
            return next(error)
        }

        if (user == null) {
            return response.redirect('/login')
        }

        request.logIn(user, error => {
            if (error) {
                return next(error)
            }

            const command = `UPDATE users SET last_login = now() WHERE id = $1;`
            database.query(command, user.id)

            return response.redirect('/answer')
        })
    })(request, response, next)
}


passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    database.findUserById(id).then(user => done(null, user))
})


module.exports = {
    configure: configure,
    authenticate: authenticate,
}