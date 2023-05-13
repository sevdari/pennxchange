import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { loginUser } from '../api/userCalls';
import CredentialWarningComponent from './CredentialWarningComponent';
import FormInputComponent from './FormInputComponent';
import './Login.css';

function Login({
  setIsAuthenticated,
}) {
  let userPennId;
  let userPassword;

  const navigate = useNavigate();
  const [missingCredential, setMissingCredential] = useState(false);
  const [incorrectCredential, setIncorrectCredential] = useState(false);

  // useEffect(() => {
  //   setIsAuthenticated(false);
  // });

  const handleOnChange = (e) => {
    if (e.target.name === 'Penn ID') {
      userPennId = e.target.value;
    } else {
      userPassword = e.target.value;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMissingCredential(false);
    setIncorrectCredential(false);

    if (userPennId && userPassword) {
      const loginObject = {
        pennId: userPennId,
        password: userPassword,
      };
      const response = await loginUser(loginObject);
      document.getElementById('form').reset();
      userPennId = '';
      userPassword = '';
      if (response === false) {
        setIncorrectCredential(true);
      } else {
        setIncorrectCredential(false);
        setMissingCredential(false);
        setIsAuthenticated(true);
        sessionStorage.setItem('app-token', response);
        navigate('/home');
      }
    } else {
      document.getElementById('form').reset();
      userPennId = '';
      userPassword = '';
      setMissingCredential(true);
    }
  };

  return (
    <div className="login-main">
      <div>
        <img className="login-img" src="/Login.svg" alt="login-img-alt" />
      </div>
      <form id="form" className="login-form">
        <div className="login-container">
          <img className="logo" src="/Logo.svg" alt="logo-alt" />
          <div className="line" />
          <p className="slogan">Empowering Students with Affordable Pre-Loved Treasures.</p>
          <FormInputComponent name="Penn ID" type="text" placeholder="12345678" onChange={handleOnChange} />
          <FormInputComponent name="Password" type="password" placeholder="********" onChange={handleOnChange} />
          <Link to="/home">
            <button className="button" type="button" onClick={handleSubmit}>Login</button>
          </Link>
          <div />
          <Link to="/forgotpassword" className="forgot">Forgot your password?</Link>
          {missingCredential && <CredentialWarningComponent credential={missingCredential} setCredential={setMissingCredential} text="Credentials Missings." />}
          {!incorrectCredential ? (<p className="empty" />) : (<CredentialWarningComponent credential={incorrectCredential} setCredential={setIncorrectCredential} text="Incorrect Credentials." />)}
          <div className="new_here">
            <div className="inner-line" />
            <p>New here?</p>
            <div className="inner-line" />
          </div>
          <div />
          <Link to="/signup">
            <button type="button" className="signup">Sign up for a new account!</button>
          </Link>
        </div>
        <div className="footer">
          <div className="footer-items">
            <Link to="/charity" className="singleton">About us</Link>
            <Link to="/charity" className="singleton">Contact</Link>
            <Link to="/charity" className="singleton">Donate</Link>
            <Link to="https://www.upenn.edu/" className="singleton">UPenn</Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};
