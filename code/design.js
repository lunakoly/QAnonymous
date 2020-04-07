function isValidUsername(username) {
    return /^[a-zA-Z0-9_]+$/.test(username)
}

function isValidPassword(password) {
    return password.length >= 8
}

function isValidEmail(email) {
    return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)
}


module.exports = {
    isValidUsername: isValidUsername,
    isValidPassword: isValidPassword,
    isValidEmail: isValidEmail,
}