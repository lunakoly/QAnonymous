const username          = document.getElementById('username')
const password          = document.getElementById('password')
const password_repeat   = document.getElementById('password_repeat')
const password_current  = document.getElementById('password_current')
const email             = document.getElementById('email')


function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{1,50}$/.test(username)
}

function isValidPassword(password) {
    return password.length >= 8 && password.length <= 72
}

function isValidEmail(email) {
    return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)
}


function ensureValidUsername() {
    if (!isValidUsername(username.value)) {
        username.classList.remove('valid')
        username.classList.add('invalid')
    } else {
        username.classList.remove('invalid')
        username.classList.add('valid')
    }
}

function checkPasswords() {
    if (password.value != password_repeat.value) {
        password_repeat.classList.remove('valid')
        password_repeat.classList.add('invalid')
        return false
    } else {
        password_repeat.classList.remove('invalid')
        password_repeat.classList.add('valid')
        return true
    }
}

function ensureValidPassword() {
    if (!isValidPassword(password.value)) {
        password.classList.remove('valid')
        password.classList.add('invalid')
    } else {
        password.classList.remove('invalid')
        password.classList.add('valid')
    }
}

function ensureValidCurrentPassword() {
    if (!isValidPassword(password_current.value)) {
        password_current.classList.remove('valid')
        password_current.classList.add('invalid')
    } else {
        password_current.classList.remove('invalid')
        password_current.classList.add('valid')
    }
}

function ensureValidEmail() {
    if (!isValidEmail(email.value)) {
        email.classList.remove('valid')
        email.classList.add('invalid')
    } else {
        email.classList.remove('invalid')
        email.classList.add('valid')
    }
}


function addKeyEvent(element, callback) {
    element.addEventListener('keydown', callback)
    element.addEventListener('keyup', callback)
}

function hasUsernameIssues() {
    if (!isValidUsername(username.value)) {
        alert('Username must consist of 1 to 50 symbols like: [a-zA-Z0-9_]')
        return true
    }

    return false
}

const PASSWORD_ERROR = 'Password must contain from 8 to 72 symbols'

function hasPasswordIssues() {
    if (!isValidPassword(password.value)) {
        alert(PASSWORD_ERROR)
        return true
    }

    return false
}

function hasEmailIssues() {
    if (!isValidEmail(email.value)) {
        alert('Email is invalid')
        return true
    }

    return false
}

function hasLoginIssues() {
    return hasUsernameIssues() || hasPasswordIssues()
}

function hasRegisterIssues() {
    if (
        hasLoginIssues() ||
        hasEmailIssues()
    ) {
        return true
    }

    if (!checkPasswords()) {
        alert('Passwords must be equal')
        return true
    }

    return false
}

function hasUpdateInfoIssues() {
    return hasUsernameIssues() || hasEmailIssues()
}

function hasUpdatePasswordIssues() {
    if (hasPasswordIssues()) {
        return true
    }

    if (!isValidPassword(password_current.value)) {
        alert(PASSWORD_ERROR)
        return true
    }

    if (!checkPasswords()) {
        alert('Passwords must be equal')
        return true
    }

    return false
}


if (username) {
    addKeyEvent(username, ensureValidUsername)
}

if (password) {
    addKeyEvent(password, ensureValidPassword)
}

if (password_repeat) {
    addKeyEvent(password, checkPasswords)
    addKeyEvent(password_repeat, checkPasswords)
}

if (password_current) {
    addKeyEvent(password_current, ensureValidCurrentPassword)
}

if (email) {
    addKeyEvent(email, ensureValidEmail)
}
