import React, { Fragment, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import _ from 'lodash';
import {Key, MailOutline} from "@mui/icons-material";
import { makeStyles } from '@material-ui/core/styles';
import {Divider, Grid,  InputAdornment, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';
import './authcss/LoginRegister.css';
import Input from '../../components/Atoms/form/Input'
import {FEDERAL_SIGNUP_LINK} from "../constants";
import Password from "../Atoms/form/Password";
import {isEmailValid} from "../../utils/utils";
import useMutation from "../../hooks/useMutation";
import {ENHANCED_DASHBOARD} from "../client/routes";
import {notification} from "../../actions/alert";
import {LoadingButton} from "../Atoms";

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

const Login = (props) => {
  const {state: {from = {}} = {}} = props.location || {},
      {pathname: redirectLink = ''} = from || {};
  const dispatch = useDispatch(),
    history = useHistory();
  const classes = useStyles();
  const [errors, setErrors] = useState({email: '', password: ''});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }),
      {mutation, loading } = useMutation('/api/auth');

  const { email, password } = formData;

  const onChange = ({name, value}) => {
    setFormData({ ...formData, [name]: value });
    setErrors({...errors, [name]: ''})
  }

  function afterSubmit({data, success}) {
    if(success) {
      dispatch(login({success, data}));
      history.push(redirectLink || ENHANCED_DASHBOARD);
    } else {
      const { errors = [] } = data || {},
          [{ msg = '' }] = errors || [{}];
      notification(msg, 'error')
    }
  }

  const onSubmit = async e => {
    e.preventDefault();
    const err = {};
    if(!formData.email) {
      Object.assign(err, { email: 'Email is required' })
    }
    if(!formData.password) {
      Object.assign(err, { password: 'Password is required' })
    }
    if(!isEmailValid(formData.email)) {
      Object.assign(err, { email: 'Invalid Email' })
    }

    if(_.isEmpty(err)){
      mutation({email, password}, null, afterSubmit);
    } else {
      setErrors(err);
    }
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
              <Grid container component='form' onSubmit={onSubmit} spacing={2} noValidate px={3}>
                {redirectLink && <Typography variant='subtitle2' color='error' align='center' sx={{width: '100%', textTransform: 'capitalize'}}>
                  Invalid session. Please Login again.
                </Typography>}
                <Grid item xs={12}>
                  <Input
                      placeholder="Email"
                      type="email"
                      onChange={onChange}
                      value={email}
                      name='email'
                      autoFocus={true}
                      fullWidth={true}
                      errors={errors}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">
                          <MailOutline />
                        </InputAdornment>,
                      }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Password
                      label={null}
                      placeholder="Password"
                      onChange={onChange}
                      name="password"
                      value={password}
                      errors={errors}
                      startAdornment={<InputAdornment position="start">
                        <Key />
                      </InputAdornment>}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LoadingButton type="submit" isLoading={loading} loadingText='Signing In...'>
                    Sign in
                  </LoadingButton>
                </Grid>
              </Grid>
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
