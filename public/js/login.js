send_button.addEventListener('click', e => {
    if (!hasLoginIssues()) {
        login_form.submit()
    }
})