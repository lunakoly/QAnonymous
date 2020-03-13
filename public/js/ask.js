// const socket = io()


// socket.on('question-received', () => {
//     question_input.value = ''
// })


document.addEventListener('DOMContextLoaded', e => {

})


function isBlank(string) {
    return string.replace(/\s+/g, '').length == 0
}

function send() {
    if (!isBlank(question_input.value)) {
        question_form.submit()
        // socket.emit('question', {
        //     target: 'luna_koly',
        //     question: question
        // })
    } else {
        alert('Empty text may not be sent.')
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