import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "./authcss/LoginRegister.css";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";
import { RegisterInput } from "../HelperCells";

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    companyname: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, companyname, email, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  console.log("formData", formData);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("Password do not match", "danger");
    } else {
      register({ name, companyname, email, password });
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <section className="login">
      <div className="auth-wrapper">
        <form className="auth-inner" onSubmit={(e) => onSubmit(e)}>
          <h3>Sign Up</h3>

          <RegisterInput
            label="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
          />
          <RegisterInput
            label="Company"
            name="companyname"
            value={companyname}
            onChange={(e) => onChange(e)}
          />
          <RegisterInput
            label="Email address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => onChange(e)}
          />
          <RegisterInput
            type="password"
            label="Password"
            name="password"
            value={password}
            onChange={(e) => onChange(e)}
          />
          <RegisterInput
            type="password"
            label="Password"
            name="password2"
            value={password2}
            onChange={(e) => onChange(e)}
          />

          <button type="submit" className="btn btn-primary btn-block">
            Sign Up
          </button>
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
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
