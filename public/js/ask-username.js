function isBlank(string) {
    return string.replace(/\s+/g, '').length == 0
}

function isValidMessage(message) {
    return !isBlank(message) && message.length > 0 && message.length <= 500
}

function send() {
    if (isValidMessage(question_input.value)) {
        question_form.submit()
    } else {
        if (question_input.value.length > 500) {
            alert('Sorry, but messages longer than 500 symbols are not allowed :(')
        } else {
            alert('Empty text may not be sent.')
        }
    }
}


send_button.addEventListener('click', e => {
    send()
})

question_input.addEventListener('keydown', e => {
    if (e.key == 'Enter' && e.ctrlKey) {
        send()
    }
})


console.log('Username: ' + USERNAME)