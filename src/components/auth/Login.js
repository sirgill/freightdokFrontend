import React, { Fragment, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';
import './authcss/LoginRegister.css';
import Grid from '@mui/material/Grid';
import EmailIcon from '@mui/icons-material/Email';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@mui/material/Button';
import { Divider, Typography } from '@mui/material';
import { Form, FormGroup, Input, InputGroup, InputGroupText, InputGroupAddon } from 'reactstrap';
import {FEDERAL_SIGNUP_LINK} from "../constants";

  const useStyles = makeStyles(() => ({
    root: {
      textAlign: "center",
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
      width: 445
    }
  }));
  const verticalAlignStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

const Login = () => {
  const dispatch = useDispatch(),
    history = useHistory();
  const classes = useStyles();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [processingAsync, setProcessingAsync] = useState(false);

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(login({ email, password }, history, setProcessingAsync));
  };

  //Redirect if logged in
  // if (isAuthenticated) {
  //   return <Redirect to='/dashboard' />;
  // }

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
                <Button variant='contained' type="submit" disabled={processingAsync}>
                  {processingAsync ? 'Signing In...' : 'Sign in' }
                </Button>
              </Form>
              <br/>
                <Link to={FEDERAL_SIGNUP_LINK} className="text-center" underline="none">Register</Link>
            </Grid>
          </Grid>
        </div>
      </section>
    </Fragment>
  );

};

Login.propTypes = {
  isAuthenticated: PropTypes.bool

};
export default (Login);
