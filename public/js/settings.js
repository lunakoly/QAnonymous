send_info.addEventListener('click', e => {
    if (!hasUpdateInfoIssues()) {
        info_form.submit()
    }
})

send_password.addEventListener('click', e => {
    if (!hasUpdatePasswordIssues()) {
        password_form.submit()
    }
})