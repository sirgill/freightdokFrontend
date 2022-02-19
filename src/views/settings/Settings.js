import { Button, Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { createProfile } from '../../actions/profile';
import InputField from '../../components/Atoms/form/InputField';
import { blue } from '../../components/layout/ui/Theme';
import DummyUser from '../../assets/dummy-user.png';

const Settings = ({ history = {} }) => {
    const {profile = {}} = useSelector(state => state.profile);
    const [imageURL, setImageUrl] = useState(null);
    const [formData, setFormData] = useState(profile),
        dispatch = useDispatch(),
        imgStyle = {
        'width': '80px',
            'height': '80px',
            'objectFit': 'cover',
            'borderRadius': '100%'
    }
    const { company = '', title = '', name, image, imageUrl } = formData;


    const onChange = e => {
        if(e.target.type==='file'){
            const profileImg = e.target.files;
            let reader = new FileReader();
            reader.onload = (e) => {
                setImageUrl(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
            return setFormData({...formData, [e.target.name]: profileImg })
        }
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const onSubmit = e => {
        e.preventDefault();
        console.log(formData)
        dispatch(createProfile(formData, history, true))
    };

    return <Dialog open={true} maxWidth='md' fullScreen={window.innerWidth <= 550}>
        <DialogTitle textAlign='center' sx={{color: blue, fontWeight: 400}}>Settings</DialogTitle>
        <DialogContent dividers>
            <form onSubmit={onSubmit}>
                <Grid container justify="center" alignItems="center" sx={{ width: 350 }} direction={'column'}>

                    <div className="form-field">
                        <label htmlFor={'upload'} className="form-profile-image" style={{ 'textAlign': 'center', 'marginBottom': '20px' }}>
                            {imageURL ? <img src={imageURL} style={imgStyle} /> : <img src={imageUrl || DummyUser} alt="main-logo" style={imgStyle}/>}
                            <InputField type='file' accept="image/*" name='image' style={{display: 'none'}} id={'upload'} onChange={onChange} />
                        </label>
                    </div>
                    {/* <Grid item xs={12}>
                        <InputField id="company" name="company" type="text" label="Company" value={company} onChange={e => onChange(e)} />
                    </Grid> */}

                    <Grid item xs={12}>
                        <InputField name="name" label="Name" value={name} onChange={onChange} />
                    </Grid>
                    <Grid item xs={12}>
                        <InputField name="title" label="Title" type="text" value={title} onChange={onChange} />
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
