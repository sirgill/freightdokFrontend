const validatePasswords = (currentPass, pass, confirmPass) => {
    let isValid = true;
    const err = {}
    if (!currentPass) {
        isValid = false
        err.currentPass = 'Please enter Current Password'
    }
    if (!pass) {
        err.pass = 'Please enter Password'
        isValid = false
    }
    if (!confirmPass) {
        err.confirmPass = 'Please enter Confirm Password'
        isValid = false
    }
    return {isValid, err};
}

const validatePasswordsPreLogin = ({pass, confirmPass, otp}) => {
    let isValid = true;
    const err = {}
    if (!pass) {
        isValid = false
        err.pass = 'Please enter Password'
    }
    if (!confirmPass) {
        err.confirmPass = 'Please enter Confirm Password'
        isValid = false
    }
    if (!otp) {
        isValid = false;
        err.otp = 'Please enter OTP'
    }

    return {isValid, err};
}

export {
    validatePasswords,
    validatePasswordsPreLogin
}