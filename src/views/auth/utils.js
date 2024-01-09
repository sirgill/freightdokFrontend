const validatePasswords = (currentPass, pass, confirmPass) => {
    let isValid = true;
    const err = {}
    if (!currentPass) {
        isValid = false
        err.currentPass = 'Please enter Current Password'
    }
    if (!pass) {
        err.pass = 'Please enter Password'
        isValid= false
    }
    if (!confirmPass) {
        err.confirmPass = 'Please enter Confirm Password'
        isValid= false
    }
    return {isValid, err};
}

export {
    validatePasswords
}