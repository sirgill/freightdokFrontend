import {Box, Button, Stack, Typography} from "@mui/material";
import React, {useState} from "react";
import InputField from "../Atoms/form/InputField";
import {getMainNodeServerUrl} from "../../config";
import {notification} from "../../actions/alert";

const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
};

const SetPassword = (props) => {
    const {history} = props;
    const params = new URLSearchParams(window.location.search)
    const [formData, setFormData] = useState({password: '', confirm: ''});
    const urlData = JSON.parse(params.get('encodedData'));
    const [errors, setErrors] = useState('');

    const onSubmit = (e) => {
        e.preventDefault()
        const {password, confirm} = formData;
        if (password !== confirm) {
            setErrors('Passwords do not match')
            return;
        }
        const {type = 'ownerOperator'} = urlData;
        fetch(getMainNodeServerUrl() + '/api/register/' + type, {
            method: 'post',
            body: JSON.stringify({password, ...urlData}),
            headers: {
                'content-type': "application/json"
            }
        })
            .then(res => res.json())
            .then(res => {
                const {success, message} = res;
                notification(message, success ? 'success' : 'error');
                if (success) {
                    history.push('/login');
                }
            })
            .catch(err => {
                console.log('err', err.message)
            })
    }

    const onChange = ({target: {name, value}}) => {
        setFormData({...formData, [name]: value})
        if (errors) setErrors('')
    }

    return (
        <div>
            <Box sx={{position: "relative"}} className={"landingPageContainer"}>
                <Box component="main" p={8}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems={"center"}
                    >
                        <Typography sx={{color: "#0091FF", fontSize: 32, fontWeight: 700}}>
                            freightdok.
                        </Typography>
                    </Stack>
                </Box>
                <section className="login">
                    <div className="auth-wrapper" style={verticalAlignStyle}>
                        <form className="auth-inner" onSubmit={onSubmit}>
                            <h3>Set Password</h3>

                            <InputField
                                label='Password'
                                name='password'
                                value={formData.password}
                                onChange={onChange}
                                type='password'
                            />
                            <InputField
                                label='Confirm Password'
                                name='confirm'
                                value={formData.confirm}
                                onChange={onChange}
                                type='password'
                            />
                            <Button type="submit" variant='contained' disabled={false}>
                                Sign Up
                            </Button>
                            {errors &&
                                <Typography color={'error'} sx={{mt: 1, textAlign: 'center'}}>{errors}</Typography>}
                        </form>
                    </div>
                </section>
            </Box>

        </div>
    )
}

export default SetPassword;