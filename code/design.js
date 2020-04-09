function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{1,50}$/.test(username)
}

function isValidPassword(password) {
    return password.length >= 8 && password.length <= 72
}

function isValidEmail(email) {
    return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)
}

function isBlank(string) {
    return string.replace(/\s+/g, '').length == 0
}

function isValidMessage(message) {
    return !isBlank(message) && message.length > 0 && message.length <= 500
}


module.exports = {
    isValidUsername: isValidUsername,
    isValidPassword: isValidPassword,
    isValidEmail: isValidEmail,
    isBlank: isBlank,
    isValidMessage: isValidMessage,
}