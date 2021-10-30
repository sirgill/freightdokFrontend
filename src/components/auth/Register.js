import React, { Fragment, useState }  from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import './authcss/LoginRegister.css';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';
import axios from 'axios';


const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    companyname: '',
    email: '',
    password: '',
    password2: ''

  });

  const { name, companyname, email, password, password2 } = formData;

  const onChange = e =>
   setFormData({ ...formData, [e.target.name]: e.target.value });

   const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Password do not match', 'danger');
    } else {
      register({ name, companyname, email, password });
    }
  };

  if(isAuthenticated) {
    return <Redirect to='/dashboard'/>;
  }

  return (
    <section className="login">
    <div className="auth-wrapper">
    <form className="auth-inner" onSubmit={e => onSubmit(e)}>

                <h3>Sign Up</h3>

                <div className="form-group">
                    <label>Name</label>
                    <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name='name'
                    value={name}
                    onChange={e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <label>Company</label>
                    <input
                    type="text"
                    className="form-control"
                    name='companyname'
                    value={companyname}
                    onChange={e => onChange(e)}
                    placeholder="company"
                    />
                </div>

                <div className="form-group">
                    <label>Email address</label>
                    <input type="email"
                    className="form-control"
                    placeholder="Enter email"
                    name='email'
                    value={email}
                    onChange={e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password"
                    className="form-control"
                    placeholder="Enter password"
                    name='password'
                    value={password}
                    onChange={e => onChange(e)}
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input type="password"
                    className="form-control"
                    placeholder="Enter password"
                    name='password2'
                    value={password2}
                    onChange={e => onChange(e)}
                    />
                </div>


                <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
                <p className="forgot-password text-right">
                    Already registered <a href="#">sign in?</a>
                </p>
            </form>
            </div>
            </section>

  );

};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});


export default connect(mapStateToProps, {setAlert, register})(Register);
