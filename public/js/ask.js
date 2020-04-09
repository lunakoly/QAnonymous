function isBlank(string) {
    return string.replace(/\s+/g, '').length == 0
}

function send() {
    if (!isBlank(search.value)) {
        window.location.href = '/ask/' + search.value
    } else {
        alert('Empty text may not be sent.')
    }
}


send_button.addEventListener('click', e => {
    send()
})

search.addEventListener('keydown', e => {
    if (e.key == 'Enter') {
        e.preventDefault()
        send()
    }
})
