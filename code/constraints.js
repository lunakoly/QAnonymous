const { asset } = require('./common')

const authentication = require('./authentication')
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
        message: `${username} is not a valid username.`,
        loggedIn: request.isAuthenticated()
    })
}

function requireValidPassword(request, response, next) {
    const password = request.body.password

    if (design.isValidPassword(password)) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `Invalid password specified.`,
        loggedIn: request.isAuthenticated()
    })
}

function requireValidEmail(request, response, next) {
    const email = request.body.email

    if (design.isValidEmail(email)) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `Email ${request.body.email} is invalid.`,
        loggedIn: request.isAuthenticated()
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
        message: `No such user found: ${username}.`,
        loggedIn: request.isAuthenticated()
    })
}

async function requireUserNotExists(request, response, next) {
    const username = request.params.username || request.body.username
    const user = await database.findUserByUsername(username)

    if (user == null) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `User ${username} already exists!`,
        loggedIn: request.isAuthenticated()
    })
}

async function requireUserNotExistsOrSelf(request, response, next) {
    const username = request.params.username || request.body.username

    if (username == request.user.username) {
        return next()
    }

    const user = await database.findUserByUsername(username)

    if (user == null) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `User ${username} already exists!`,
        loggedIn: request.isAuthenticated()
    })
}

async function requireTopicExists(request, response, next) {
    const topic = await database.findTopicById(request.params.id)

    if (topic != null) {
        fit(request, { topic: topic })
        return next()
    }

    return response.render(asset('error.html'), {
        message: `No such topic found: ${request.params.id}.`,
        loggedIn: request.isAuthenticated()
    })
}

function requireAdmin(request, response, next) {
    if (authentication.isAdmin(request.user)) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `This operation requires admin privileges.`,
        loggedIn: request.isAuthenticated()
    })
}

async function requireCurrentPasswordMatch(request, response, next) {
    const password_current = request.body.password_current

    if (!design.isValidPassword(password_current)) {
        return response.render(asset('error.html'), {
            message: `Invalid password specified.`,
            loggedIn: request.isAuthenticated()
        })
    }

    const user = await database.findUserByUsernameAndPassword(request.user.username, password_current)

    if (user == null) {
        return response.render(asset('error.html'), {
            message: `Current password is wrong.`,
            loggedIn: request.isAuthenticated()
        })
    }

    return next()
}

function requireValidQuestion(request, response, next) {
    const question = request.body.question

    if (design.isValidMessage(question)) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `Invalid question.`,
        loggedIn: request.isAuthenticated()
    })
}

function requireValidAnswer(request, response, next) {
    const answer = request.body.answer

    if (design.isValidMessage(answer)) {
        return next()
    }

    return response.render(asset('error.html'), {
        message: `Invalid answer.`,
        loggedIn: request.isAuthenticated()
    })
}


module.exports = {
    requireAuthenticated: requireAuthenticated,
    requireNotAuthenticated: requireNotAuthenticated,
    requireValidUsername: requireValidUsername,
    requireValidPassword: requireValidPassword,
    requireValidEmail: requireValidEmail,
    requireUserExists: requireUserExists,
    requireTopicExists: requireTopicExists,
    requireUserNotExists: requireUserNotExists,
    requireAdmin: requireAdmin,
    requireCurrentPasswordMatch: requireCurrentPasswordMatch,
    requireValidQuestion: requireValidQuestion,
    requireValidAnswer: requireValidAnswer,
    requireUserNotExistsOrSelf: requireUserNotExistsOrSelf,
}