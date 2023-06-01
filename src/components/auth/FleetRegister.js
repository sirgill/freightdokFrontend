import React, { useState } from "react";
import { connect } from "react-redux";
import {Link, Redirect} from "react-router-dom";
import "./authcss/LoginRegister.css";
import {notification, setAlert} from "../../actions/alert";
import { register } from "../../actions/auth";
import PropTypes from "prop-types";
import { RegisterInput } from "../HelperCells";
import axios from "axios";
import {development} from "../../config";

const Fleet = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: "",
    companyname: "",
    email: "",
    phone: ''
  });

  const { name, companyname, email, phone } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try{
      let {data = {}, status} = await axios.get(`https://mobile.fmcsa.dot.gov/qc/services/carriers/${companyname}?webKey=e1b9823bbb9dd36dc33b53bc0e8ed0710f1bedca`, {
        headers : {
          'content-type': "application/json"
        }
      });

      if(status === 200 && data.content) {
        fetch(development.nodeServerUrl + "/fleetOwnerOperatorMail", {
          method: 'post',
          body: JSON.stringify({ ...formData, type: 'fleetOwner', ...data }),
          headers: {
            'content-type': "application/json"
          }
        })
            .then(res => res.json())
            .then(({message, success} = {}) => {
              notification(message, success ? 'success': 'error');
            })
            .catch(e => notification(e.message, "error"));
      }
      else if(!data.content) {
        notification('Cannot verify DOT#. Please check again.', 'error')
      }
    } catch (e) {
      console.log(e.message)
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const verticalAlignStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <section className="login">
      <div className="auth-wrapper" style={verticalAlignStyle}>
        <form className="auth-inner" onSubmit={onSubmit}>
          <h3>Fleet Operator Registration</h3>

          <RegisterInput
            label="Name"
            name="name"
            value={name}
            onChange={(e) => onChange(e)}
          />
          <RegisterInput
            label="DOT#"
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
            label="Phone Number"
            name="phone"
            value={phone}
            onChange={onChange}
          />

          <button type="submit" className="btn btn-primary btn-block">
            Sign Up
          </button>
          <p className="forgot-password text-center">
            Already registered <Link to="/login">sign in?</Link>
          </p>
        </form>
      </div>
    </section>
  );
};

Fleet.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Fleet);
