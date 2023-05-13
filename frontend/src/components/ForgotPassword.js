import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CredentialWarningComponent from './CredentialWarningComponent';
import FormInputComponent from './FormInputComponent';
import './ForgotPassword.css';
import { forgotPassword } from '../api/userCalls';

function ForgotPassword() {
  let pennId;
  let newPassword;

  const navigate = useNavigate();
  const [missingCredential, setMissingCredential] = useState(false);
  const [incorrectCredential, setIncorrectCredential] = useState(false);

  const handleOnChange = (e) => {
    if (e.target.name === 'Penn ID') {
      pennId = e.target.value;
    } else {
      newPassword = e.target.value;
    }
  };

  // const handleBackToLogin = () => {
  //   window.history.pushState('string', '', '/login');
  //   window.location.reload();
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pennId && newPassword) {
      const user = {
        pennId,
        password: newPassword,
      };
      const response = await forgotPassword(user);
      if (!response || response.status !== 200) {
        setIncorrectCredential(true);
      } else {
        navigate('/login');
      }
    } else {
      setMissingCredential(true);
    }
  };

  return (
    <div className="fp-main">
      <div>
        <img className="login-img" src="/ForgotPassword.svg" alt="" />
      </div>
      <div className="fp-form">
        <div className="fg-container">
          <img className="logo" src="/Logo.svg" alt="logo" />
          <div className="line" />
          <p className="slogan">Don&apos;t worry. We got you!</p>
          <FormInputComponent name="Penn ID" type="text" placeholder="12345678" onChange={handleOnChange} />
          <FormInputComponent name="New Password" type="password" placeholder="********" onChange={handleOnChange} />
          <Link to="/login">
            <button className="resetPassword" type="button" onClick={handleSubmit}>Reset Password</button>
          </Link>
          <div />
          <Link to="/login" type="button" className="backToLogin">Back to Login.</Link>
          {missingCredential && <CredentialWarningComponent credential={missingCredential} setCredential={setMissingCredential} text="Credentials Missings." />}
          {!incorrectCredential ? (<p className="empty" />) : (<CredentialWarningComponent credential={incorrectCredential} setCredential={setIncorrectCredential} text="Incorrect Credentials." />)}
          <div className="issue">
            <div className="inner-line" />
            <p>Have an issue?</p>
            <div className="inner-line" />
          </div>
          <p className="call">Call us at: +1-445-234-2385</p>
        </div>
        <div className="footer">
          <div className="footer-items">
            <p className="singleton">About us</p>
            <p className="singleton">Contact</p>
            <p className="singleton">Donate</p>
            <p className="singleton">UPenn</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
