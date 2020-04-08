function isValidUsername(username) {
    return /^[a-zA-Z0-9_]{1,50}$/.test(username)
}

function isValidPassword(password) {
    return password.length >= 8 && password.length <= 72
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

function ensureValidPassword() {
    if (!isValidPassword(password.value)) {
        password.classList.remove('valid')
        password.classList.add('invalid')
    } else {
        password.classList.remove('invalid')
        password.classList.add('valid')
    }
}


nik_input.addEventListener('keydown', e => ensureValidUsername())
nik_input.addEventListener('keyup', e => ensureValidUsername())

password.addEventListener('keydown', e => ensureValidPassword())
password.addEventListener('keyup', e => ensureValidPassword())

send_button.addEventListener('click', e => {
    if (!isValidUsername(nik_input.value)) {
        return alert('Nik name must consist of 1 to 50 symbols like: [a-zA-Z0-9_]')
    }

    if (!isValidPassword(password.value)) {
        return alert('Password must contain from 8 to 72 symbols')
    }

    login_form.submit()
})