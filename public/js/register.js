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
    if (!isValidUsername(nik_input.value)) {
        nik_input.classList.remove('valid')
        nik_input.classList.add('invalid')
    } else {
        nik_input.classList.remove('invalid')
        nik_input.classList.add('valid')
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

function ensureValidEmail() {
    if (!isValidEmail(email.value)) {
        email.classList.remove('valid')
        email.classList.add('invalid')
    } else {
        email.classList.remove('invalid')
        email.classList.add('valid')
    }
}


nik_input.addEventListener('keydown', e => ensureValidUsername())
nik_input.addEventListener('keyup', e => ensureValidUsername())

password.addEventListener('keydown', e => {
    ensureValidPassword()
    checkPasswords()
})

password.addEventListener('keyup', e => {
    ensureValidPassword()
    checkPasswords()
})

password_repeat.addEventListener('keydown', e => checkPasswords())
password_repeat.addEventListener('keyup', e => checkPasswords())

email.addEventListener('keydown', e => ensureValidEmail())
email.addEventListener('keyup', e => ensureValidEmail())

send_button.addEventListener('click', e => {
    if (!isValidUsername(nik_input.value)) {
        return alert('Nik name must consist of 1 to 50 symbols like: [a-zA-Z0-9_]')
    }

    if (!isValidPassword(password.value)) {
        return alert('Password must contain from 8 to 72 symbols')
    }

    if (!isValidEmail(email.value)) {
        return alert('Email is invalid')
    }

    if (checkPasswords()) {
        register_form.submit()
    } else {
        alert('Passwords must be equal')
    }
})