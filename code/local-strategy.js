const database = require('./database')
const design = require('./design')

const { Strategy } = require('passport-local')


function authenticate(username, password, done) {
    // by this time this check should have
    // already been performed but I'll
    // do it here once again just in case
    if (
        !design.isValidUsername(username) ||
        !design.isValidPassword(password)
    ) {
        return done(null, false)
    }

    return database
        .findUserByUsernameAndPassword(username, password)
        .then(user => {
            if (user != null) {
                return done(null, user)
            }

            return done(null, false)
        })
}


module.exports = new Strategy(authenticate)