send_button.addEventListener('click', e => {
    if (!hasRegisterIssues()) {
        register_form.submit()
    }
})