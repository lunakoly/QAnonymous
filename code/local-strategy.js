const database = require('./database')
const design = require('./design')

const { Strategy } = require('passport-local')


function authenticate(username, password, done) {
    // by this time this check should have
    // already been performed but I'll
    // do it here once again just in case
    if (!design.isValidUsername(username)) {
        return done(null, false)
    }

    return database
        .findUserByUsername(username)
        .then(user => {
            if (user != null && user.password == password) {
                return done(null, user)
            }

            return done(null, false)
        })
}


module.exports = new Strategy(authenticate)