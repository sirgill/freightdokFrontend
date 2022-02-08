import { Button, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createProfile } from '../../actions/profile';
import InputField from '../../components/Atoms/form/InputField';
import { blue } from '../../components/layout/ui/Theme';
import DummyUser from '../../assets/dummy-user.png';

const Settings = ({ history = {} }) => {
    const [formData, setFormData] = useState({
        company: '',
        title: '',
        name: '',
        image: null
    }),
        dispatch = useDispatch();
    const { company = '', title = '', name, image, imageUrl } = formData;

    const onChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        dispatch(createProfile(formData, history, true))
    };

    return <Dialog open maxWidth='md' fullScreen={window.innerWidth <= 550}>
        <DialogTitle textAlign='center' sx={{color: blue}}>Settings</DialogTitle>
        <DialogContent>
            <form onSubmit={onSubmit}>
                <Grid container justify="center" alignItems="center" sx={{ width: 350 }} direction={'column'}>

                    <div className="form-field">
                        <div className="form-profile-image" style={{ 'textAlign': 'center', 'marginBottom': '20px' }}>
                            <img src={DummyUser} alt="main-logo" style={{'width': '80px', 'height': '80px', 'objectFit': 'cover', 'borderRadius': '100%'}} />
                        </div>
                    </div>
                    {/* <Grid item xs={12}>
                        <InputField id="company" name="company" type="text" label="Company" value={company} onChange={e => onChange(e)} />
                    </Grid> */}

                    <Grid item xs={12}>
                        <InputField name="name" label="Name" value={name} onChange={e => onChange(e)} />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField name="title" label="Title" type="text" value={title} onChange={e => onChange(e)} />
                    </Grid>
                    <Grid item xs={12}>

                        <Button fullWidth type="submit" variant="contained" color="primary" style={{ textTransform: "none" }}>Update</Button>
                    </Grid>
                </Grid>
            </form>
        </DialogContent>
    </Dialog>;
};

export default Settings;
