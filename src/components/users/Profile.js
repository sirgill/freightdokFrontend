import React, { useState, useEffect } from "react";
import { Grid, TextField, Button } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { updateUser } from "../../actions/auth";

const initialState = {
    name: '',
    email: '',
    password: '',
}

const Profile = () => {
    const { user, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [state, setState] = useState(initialState);
    useEffect(() => {
        if (user) {
            const { name, email } = user;
            setState(state => ({ ...state, name, email }));
        }
    }, []);
    const onChange = ({ target }) => {
        const { name, value } = target;
        setState(state => ({ ...state, [name]: value }));
    }
    const onSubmit = (e) => {
        e.preventDefault();
        const toUpdate = {};
        if (state.name && state.name !== user.name)
            toUpdate['name'] = state.name;
        if (state.password)
            toUpdate['password'] = state.password;
        if ((Object.keys(toUpdate)).length > 0)
            dispatch(updateUser(toUpdate));
    }
    return <Grid  container style={{ marginTop: '150px' }} justify="center" alignItems="center">
        <form onSubmit={e => onSubmit(e)}>
            <Grid container spacing={1} justify="center" alignItems="center" >
                <Grid item style={{ marginTop: '20px' }} >
                    <Face />
                </Grid>
                <Grid item >
                    <TextField id="name" name="name"  type="text" label="Name" value={state.name} onChange={e => onChange(e)} />
                </Grid>
            </Grid>
            <Grid container spacing={1}  style={{ marginTop: '10px' }}justify="center" alignItems="center">
                <Grid item style={{ marginTop: '20px' }}>
                    <Fingerprint />
                </Grid>
                <Grid item >
                    <TextField id="email" name="email" label="Email" type="email" value={state.email} disabled />
                </Grid>
            </Grid>
            <Grid container spacing={1}  style={{ marginTop: '10px' }}justify="center" alignItems="center">
                <Grid item style={{ marginTop: '20px' }}>
                    <Fingerprint />
                </Grid>
                <Grid item >
                    <TextField id="password" name="password" label="Password" type="password" value={state.password} onChange={e => onChange(e)} />
                </Grid>
            </Grid>
            <Grid container alignItems="center" justify="center" style={{ marginTop: '20px' }}>
                <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Update</Button>
                <Button button component={Link} to="/dashboard" variant="outlined" color="primary" style={{ textTransform: "none", marginLeft: '10px' }}>Back</Button>
            </Grid>
        </form>
    </Grid>
}

export default Profile;