const { asset } = require('./common')

const database = require('./database')
const design = require('./design')


function fit(request, required) {
    if (!request.required) {
        request.required = {}
    }

    for (let each in required) {
        request.required[each] = required[each]
    }
}


function requireAuthenticated(request, response, next) {
    if (request.isAuthenticated()) {
        return next()
    }

    return response.redirect('/login')
}

function requireNotAuthenticated(request, response, next) {
    if (!request.isAuthenticated()) {
        return next()
    }

    return response.redirect('/answer')
}

function requireValidUsername(request, response, next) {
    const username = request.params.username || request.body.username

    // sql injection
    if (design.isValidUsername(username)) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `${username} is not a valid username.`
    })
}

async function requireUserExists(request, response, next) {
    const username = request.params.username || request.body.username
    const user = await database.findUserByUsername(username)

    if (user != null) {
        fit(request, { user: user })
        return next()
    }

    return response.render(asset('error.html'), {
        message: `No such user found: ${username}.`
    })
}

async function requireTopicExists(request, response, next) {
    const topic = await database.findTopicById(request.params.id)

    if (topic != null) {
        fit(request, { topic: topic })
        return next()
    }

    return response.render(asset('error.html'), {
        message: `No such topic found: ${request.params.id}.`
    })
}


module.exports = {
    requireAuthenticated: requireAuthenticated,
    requireNotAuthenticated: requireNotAuthenticated,
    requireValidUsername: requireValidUsername,
    requireUserExists: requireUserExists,
    requireTopicExists: requireTopicExists,
}