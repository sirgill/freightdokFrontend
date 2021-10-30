import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, TextField, Button } from '@material-ui/core';
import { Face, Fingerprint } from '@material-ui/icons';
import { withRouter } from 'react-router-dom';
import { createProfile } from '../../actions/profile';
import DummyUser from '../../assets/dummy-user.png';

const ProfileForm = ({createProfile, history}) => {

  const [formData, setFormData] = useState({
    company: '',
    title: '',
    name: '',
    image: null
  });

  const { company, title, name, image } = formData;

  const onChange = e =>
  setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    createProfile(formData, history);
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
    setFormData({...formData, ['image']: base64Image});
  }

  return (
    <Grid  container style={{ marginTop: '150px' }} justify="center" alignItems="center">
      <form onSubmit={e => onSubmit(e)}>

          <div className="form-field">
            <div className="form-profile-image" style={{'textAlign': 'center', 'marginBottom': '20px'}}>
                <img src={image ? image : DummyUser} alt="main-logo" style={{'width': '120px', 'height': '120px', 'objectFit': 'cover', 'borderRadius': '100%'}} />
            </div>
          </div>

          <input style={{display: 'none'}} type="file" id="profile-image-input" accept="image/*" onChange={e => handleImageChange(e)} />

          <div className="form-field upload-btn" style={{'textAlign': 'center', 'marginBottom': '30px'}}>
              <Button variant="outlined" type="button" block className="btn_submit" onClick={e => openFileSelector(e)} >
                Upload Image
              </Button>
          </div>

          <Grid container spacing={1} justify="center" alignItems="center">
              <Grid item style={{ marginTop: '20px' }} >
                  <Face />
              </Grid>
              <Grid item >
                  <TextField id="company" name="company"  type="text" label="Company" value={company} onChange={e => onChange(e)} />
              </Grid>
          </Grid>
          <Grid container spacing={1}  style={{ marginTop: '10px' }}justify="center" alignItems="center">
              <Grid item style={{ marginTop: '20px' }}>
                  <Fingerprint />
              </Grid>
              <Grid item >
                  <TextField id="title" name="title" label="Title" type="text" value={title} onChange={e => onChange(e)} />
              </Grid>
          </Grid>
          <Grid container spacing={1}  style={{ marginTop: '10px' }}justify="center" alignItems="center">
               <Grid item style={{ marginTop: '20px' }}>
                <Face />
               </Grid>
               <Grid item >
                   <TextField id="name" name="name" label="Name" type="text" value={name} onChange={e => onChange(e)} />
               </Grid>
           </Grid>
          <Grid container alignItems="center" justify="center" style={{ marginTop: '20px' }}>
              <Button type="submit" variant="outlined" color="primary" style={{ textTransform: "none" }}>Next</Button>
          </Grid>
      </form>
    </Grid>
  )
}

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired
};

export default connect(null, { createProfile })(withRouter(ProfileForm));
