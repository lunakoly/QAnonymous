function isBlank(string) {
    return string.replace(/\s+/g, '').length == 0
}

function isValidMessage(message) {
    return !isBlank(message) && message.length > 0 && message.length <= 500
}

function send(answer_input, answer_form) {
    if (isValidMessage(answer_input.value)) {
        answer_form.submit()
    } else {
        if (answer_input.value.length > 500) {
            alert('Sorry, but messages longer than 500 symbols are not allowed :(')
        } else {
            alert('Empty text may not be sent.')
        }
    }
}

function configureTopic(topic) {
    const send_button = topic.querySelector('.send_button')
    const answer_form = topic.querySelector('.answer_form')
    const answer_input = topic.querySelector('textarea')

    send_button.addEventListener('click', e => {
        send(answer_input, answer_form)
    })

    answer_input.addEventListener('keydown', e => {
        if (e.key == 'Enter' && e.ctrlKey) {
            send(answer_input, answer_form)
        }
    })
}


const topics = document.getElementsByClassName('topic')

for (let it of topics) {
    configureTopic(it)
}
