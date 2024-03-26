import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Grid, TextField, Button } from '@mui/material';
import { Face, Fingerprint } from '@mui/icons-material';

import { Link, withRouter, useHistory } from 'react-router-dom';
import { createProfile, getCurrentProfile } from '../../actions/profile';
import DummyUser from '../../assets/dummy-user.png';

const EditProfile = ({ profile: { profile, loading }, createProfile, getCurrentProfile, history }) => {

  const browserHistory = useHistory();

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    name: '',
    image: null,
    imageUrl: null
  });

  const { company, title, name, image, imageUrl } = formData;

  useEffect(() => {
    getCurrentProfile();
  }, []);

  useEffect(() => {
    if (!profile)
      browserHistory.push('create-profile');
    else
      setFormData({
        company: profile.company,
        title: profile.title,
        name: profile.name,
        image: profile.imageUrl
      });
  }, [profile]);

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, true);
  };

  const openFileSelector = (e) => {
    e.preventDefault();
    let fileInput = document.getElementById('profile-image-input');
    fileInput.click();
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        resolve(reader.result)
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        reject(error)
      };
    })
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    const tempExtention = file.name.split('.');
    const fileExtention = tempExtention[tempExtention.length - 1];
    const allowedFileExtentions = ['png', 'jpg', 'jpeg'];
    if (!allowedFileExtentions.includes(fileExtention)) {
      return;
    }

    const base64Image = await getBase64(file);
    setFormData({ ...formData, ['image']: base64Image });
  }

  return (

    <Grid container style={{ marginTop: '150px' }} justifyContent="center" alignItems="center">
      <form onSubmit={e => onSubmit(e)}>

        <div className="form-field">
          <div className="form-profile-image" style={{ 'textAlign': 'center', 'marginBottom': '20px' }}>
            <img src={imageUrl ? imageUrl : image ? image : DummyUser} alt="main-logo" style={{ 'width': '120px', 'height': '120px', 'objectFit': 'cover', 'borderRadius': '100%' }} />
          </div>
        </div>

        <input style={{ display: 'none' }} type="file" id="profile-image-input" accept="image/*" onChange={e => handleImageChange(e)} />

        <div className="form-field upload-btn" style={{ 'textAlign': 'center', 'marginBottom': '30px' }}>
          <Button variant="outlined" type="button" block className="btn_submit" onClick={e => openFileSelector(e)} >
            Upload Image
          </Button>
        </div>

        <Grid container spacing={1} justifyContent="center" alignItems="center" >
          <Grid item style={{ marginTop: '20px' }} >
            <Face />
          </Grid>
          <Grid item >
            <TextField id="company" name="company" type="text" label="Company" value={company} onChange={e => onChange(e)} />
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: '10px' }} justifyContent="center" alignItems="center">
          <Grid item style={{ marginTop: '20px' }}>
            <Fingerprint />
          </Grid>
          <Grid item >
            <TextField id="title" name="title" label="Title" type="text" value={title} onChange={e => onChange(e)} />
          </Grid>
        </Grid>
        <Grid container spacing={1} style={{ marginTop: '10px' }} justifyContent="center" alignItems="center">
          <Grid item style={{ marginTop: '20px' }}>
            <Face />
          </Grid>
          <Grid item >
            <TextField id="name" name="name" label="Name" type="text" value={name} onChange={e => onChange(e)} />
          </Grid>
        </Grid>
        <Grid container alignItems="center" justifyContent="center" style={{ marginTop: '20px' }}>
          <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Update</Button>
          <Button button component={Link} to="/dashboard" variant="outlined" color="primary" style={{ textTransform: "none", marginLeft: '10px' }}>Back</Button>
        </Grid>
      </form>
    </Grid>


  );
};

EditProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile

});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(EditProfile));
