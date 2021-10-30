import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import './authcss/LoginRegister.css';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from  '@material-ui/core/Button';

const Login = ({ login, isAuthenticated }) => {
  
  const verticalAlignStyle = {position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'};
  const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        flexDirection: "row",
        textAlign: "center"
    },
  }));

  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = e =>
   setFormData({ ...formData, [e.target.name]: e.target.value });

   const onSubmit = async e => {
    e.preventDefault();
      login({email, password});
  };

  //Redirect if logged in
  if(isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
      <Fragment>
        <section className="login">
          <div className="auth-wrapper" style={verticalAlignStyle}>
            <Grid container spacing={2} className={classes.root}>
              <Grid item xs={4}></Grid>
              <Grid item xs={4} style={{textAlign: 'center'}}>
                <div className="auth-wrapper" style={verticalAlignStyle}>
                  <form className="auth-inner" onSubmit={e => onSubmit(e)}>
                    <h3 style={{color: '#1891FC'}}>Sign In</h3>

                      <TextField 
                        style={{borderColor: '#1891FC'}}
                        placeholder="Enter email"
                        type="email"
                        size="small"
                        id="email" 
                        variant="outlined" 
                        name="email"
                        value={email}
                        color="primary"
                        onChange={e => onChange(e)}
                      />

                      <TextField 
                        style={{marginTop: '5%', borderColor: '#1891FC'}}
                        placeholder="Enter Password"
                        type="password"
                        size="small"
                        id="password" 
                        variant="outlined" 
                        name="password"
                        value={password}
                        color="primary"
                        onChange={e => onChange(e)}
                      />

                      <Button type="submit" variant="contained" color="primary" style={{marginTop: '5%'}} >Submit</Button>
                      <p className="forgot-password text-right"> Forgot <a href="#">password?</a></p>
                    
                  </form>
                </div>
              </Grid>
              <Grid item xs={4}></Grid>
            </Grid>
          </div>
        </section>
      </Fragment>
  );

};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool

};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login);
