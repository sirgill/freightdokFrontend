import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import './authcss/LoginRegister.css';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import EmailIcon from '@material-ui/icons/Email';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { makeStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import { Divider, Typography } from '@material-ui/core';
import { styles } from '@material-ui/pickers/views/Calendar/Calendar';
import { Button, Form, FormGroup, Input, InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';

const Login = ({ login, isAuthenticated }) => {

  const verticalAlignStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  const useStyles = makeStyles((theme) => ({
    root: {
      textAlign: "center",
      width: '445px',
      margin: 'auto',
      background: '#F7FAFC 0% 0% no-repeat padding-box',
      boxShadow: '0px 14px 80px rgba(34, 35, 58, 0.2)',
      borderRadius: '6px',
      transition: 'all 0.3s',
    },
    typography: {
      color: '#0091FF',
      fontSize: '35px',
      font: 'normal normal bold 35px/49px Myriad Pro',
      position: 'absolute',
      left: '50%',
      transform: 'translate(-50%, 35px)',
    },
    gridTop: {
      position: 'relative',
      height: '100px'
    },
    gridBottom: {
      padding: '5rem 2rem',
    }
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
    login({ email, password });
  };

  //Redirect if logged in
  if (isAuthenticated) {
    return <Redirect to='/dashboard' />;
  }

  return (
    <Fragment>
      <section className="login">
        <div className='gradient-info'>
          <div className='separator separator-bottom separator-skew'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon className="fill-default" points="2560 0 2560 100 0 100" />
            </svg>
          </div>
        </div>
        <div className="auth-wrapper" style={verticalAlignStyle}>
          <Grid container className={classes.root} direction='row'>
            <Grid item xs={12} className={classes.gridTop}>
              <Typography className={classes.typography}>freightdok</Typography>
            </Grid>
            <Grid item xs={12} style={{ height: 'fit-content' }}>
              <Divider />
            </Grid>
            <Grid item xs={12} className={classes.gridBottom} style={{ textAlign: 'center' }}>
              <Form role='form' className="" onSubmit={onSubmit}>
                <FormGroup>
                  <InputGroup className="input-group-merge inputGroup">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <EmailIcon className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Email"
                      type="email"
                      onChange={onChange}
                      value={email}
                      name='email'
                      autoFocus
                    />
                  </InputGroup>
                </FormGroup>

                <FormGroup>
                  <InputGroup className="input-group-merge inputGroup">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <LockOpenIcon className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      onChange={onChange}
                      name="password"
                      value={password}
                    />
                  </InputGroup>
                </FormGroup>

                {/* <Button type="submit" variant="contained" color="primary" style={{ marginTop: '5%' }} >Sign in</Button> */}
                <Button className="primary-bg font-14 mt-5" type="submit">
                  Sign in
                </Button>
                <p className="forgot-password text-right"> Forgot <a href="#">password?</a></p>

              </Form>
            </Grid>
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

export default connect(mapStateToProps, { login })(Login);
