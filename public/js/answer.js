document.addEventListener('DOMContextLoaded', e => {

})


function isBlank(string) {
    return string.replace(/\s+/g, '').length == 0
}

function send(answer_input, answer_form) {
    if (!isBlank(answer_input.value)) {
        answer_form.submit()
    } else {
        alert('Empty text may not be sent.')
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
