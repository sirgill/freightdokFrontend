import React, {Fragment, useState} from "react";
import {connect} from "react-redux";
import _ from 'lodash';
import {Redirect} from "react-router-dom";
import "./authcss/LoginRegister.css";
import {notification, setAlert} from "../../actions/alert";
import {register} from "../../actions/auth";
import PropTypes from "prop-types";
import {RegisterInput} from "../HelperCells";
import {isEmailValid} from "../../utils/utils";
import {Typography, Stack, Button} from "@mui/material";
import {requestPost} from "../../utils/request";
import axios from "axios";

const defaults = {
    name: "",
    companyname: "",
    email: "",
    phone: ''
}

const OwnerOp = ({setAlert, register, isAuthenticated}) => {
    const [formData, setFormData] = useState(defaults);
    const [error, setError] = useState('')

    const {name, companyname, email, phone} = formData;

    const onChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
        if (error) setError('')
    }

    const onBlur = ({target: {value}}) => {
        if (!value) return
        if (!isEmailValid(value)) {
            setError('Email a valid Email')
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        let {data, status} = await axios.get(`https://mobile.fmcsa.dot.gov/qc/services/carriers/${companyname}?webKey=e1b9823bbb9dd36dc33b53bc0e8ed0710f1bedca`);
        console.log(status, data)
        if(status === 200 && data.content) {
            requestPost({uri: '/api/register/ownerOperator', body: { ...formData, ...data }})
                .then(r => console.log(r))
                .catch(e => notification(e.message, "error"))
        }
        else if(!data.content) {
            notification('Cannot verify DOT#. Please check.', 'error')
        }
    };

    if (isAuthenticated) {
        return <Redirect to="/dashboard"/>;
    }
    ;

    const verticalAlignStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    };

    return (
        <section className="login">
            <div className="auth-wrapper" style={verticalAlignStyle}>
                <form className="auth-inner" onSubmit={(e) => onSubmit(e)}>
                    <h3>Owner Operator Registration</h3>

                    <RegisterInput
                        label="Name"
                        name="name"
                        value={name}
                        onChange={(e) => onChange(e)}
                    />
                    <RegisterInput
                        label="DOT#"
                        name="companyname"
                        value={companyname}
                        onChange={(e) => onChange(e)}
                    />
                    <Stack sx={{mb: 2}}>
                        <RegisterInput
                            label="Email address"
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            formGroupSx={{
                                marginBottom: 0
                            }}
                            onBlur={onBlur}
                        />
                        {error && <Typography align='left' variant='subtitle2' color='error'>{error}</Typography>}
                    </Stack>
                    <RegisterInput
                        label="Phone Number"
                        name="phone"
                        value={phone}
                        onChange={onChange}
                        type='number'
                    />

                    <Button type="submit" variant='contained' disabled={_.isEqual(defaults, formData) || error}>
                        Sign Up
                    </Button>
                    <p className="forgot-password text-center">
                        Already registered <a href="/login">sign in?</a>
                    </p>
                </form>
            </div>
        </section>
    );
};

OwnerOp.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, {setAlert, register})(OwnerOp);
