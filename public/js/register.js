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
    if (password.value.length < 8) {
        password.classList.remove('valid')
        password.classList.add('invalid')
    } else {
        password.classList.remove('invalid')
        password.classList.add('valid')
    }
}

function isValidEmail(email) {
    return /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(email)
}

function verifyEmail() {
    if (!isValidEmail(email.value)) {
        email.classList.remove('valid')
        email.classList.add('invalid')
    } else {
        email.classList.remove('invalid')
        email.classList.add('valid')
    }
}


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

email.addEventListener('keydown', e => verifyEmail())
email.addEventListener('keyup', e => verifyEmail())

send_button.addEventListener('click', e => {
    if (password.value.length < 8) {
        return alert('Password must contain at least 8 symbols')
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