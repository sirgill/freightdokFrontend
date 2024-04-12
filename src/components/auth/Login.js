import React, { Fragment, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import _ from 'lodash';
import {Key, MailOutline} from "@mui/icons-material";
import {styled} from "@mui/material/styles";
import {Divider, Grid,  InputAdornment, Typography} from '@mui/material';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';
import './authcss/LoginRegister.css';
import Input from '../../components/Atoms/form/Input'
import {FEDERAL_SIGNUP_LINK, FORGOT_PASSWORD} from "../constants";
import Password from "../Atoms/form/Password";
import {isEmailValid} from "../../utils/utils";
import useMutation from "../../hooks/useMutation";
import {ENHANCED_DASHBOARD} from "../client/routes";
import {Alert, LoadingButton} from "../Atoms";
import CompanyText from "../Atoms/CompanyText";

const ContainerGrid = styled(Grid)`
  text-align: center;
  margin: auto;
  background: #F7FAFC 0% 0% no-repeat padding-box;
  box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  border-radius: 6px;
  transition: all 0.3s;
  max-width: 445px;
`

const verticalAlignStyle = { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

const Login = (props) => {
  const {state: {from = {}} = {}} = props.location || {},
      {pathname: redirectLink = ''} = from || {};
  const dispatch = useDispatch(),
    history = useHistory();
  const [errors, setErrors] = useState({email: '', password: ''});
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  }),
      [alert, setAlert] = useState({open: false, message: '', severity: 'error'}),
      {mutation, loading } = useMutation('/api/auth');

  const { email, password } = formData;

  const onChange = ({name, value}) => {
    setFormData({ ...formData, [name]: value });
    setErrors({...errors, [name]: ''})
  }

  const closeAlert = () => {
    setAlert({...alert, open: false});
  }

  function afterSubmit({data, success}) {
    if(success) {
      dispatch(login({success, data}));
      history.push(redirectLink || ENHANCED_DASHBOARD);
    } else {
      const { message } = data || {}
      setAlert({...alert, open: true, message: message || 'NETWORK ERROR'})
    }
  }

  const onSubmit = async e => {
    closeAlert();
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
          <ContainerGrid container direction='row'>
            <Grid item xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: 100}}>
              <CompanyText style={{fontSize: 35}} />
            </Grid>
            <Grid item xs={12} sx={{ height: 'fit-content' }}>
              <Divider />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: 'center', px: 4, py: 10 }}>
              <Grid container component='form' onSubmit={onSubmit} spacing={2} noValidate px={3}>
                {redirectLink && <Typography variant='subtitle2' color='error' align='center' sx={{width: '100%', textTransform: 'capitalize'}}>
                  Invalid session. Please Login again.
                </Typography>}
                <Grid item xs={12} sx={{
                  '.MuiAlert-message' : {
                    textAlign: 'left'
                  }
                }}>
                  <Alert config={alert} />
                </Grid>
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
              <Typography component={Link} to={FEDERAL_SIGNUP_LINK} sx={{display: 'block', }} align='center'>Register</Typography>
              <Typography component={Link} to={FORGOT_PASSWORD} sx={{display: 'block', }} align='center'>Forgot Password?</Typography>
            </Grid>
          </ContainerGrid>
        </div>
      </section>
    </Fragment>
  );

};

Login.propTypes = {
  isAuthenticated: PropTypes.bool

};
export default (Login);
