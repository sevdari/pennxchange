import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignUp.css';
import { ReactComponent as Congratulations } from '../icons/Congratulations.svg';
import CredentialWarningComponent from './CredentialWarningComponent';
import FormInputComponent from './FormInputComponent';
import { signupUser } from '../api/userCalls';

function SignUp() {
  let newEmail;
  let newUsername;
  let newPennID;
  let newPassword;

  const [join, setJoin] = useState(false);
  const [credential, setCredential] = useState(true);
  const handleOnChange = (e) => {
    if (e.target.name === 'Email') {
      newEmail = e.target.value;
    } else if (e.target.name === 'Username') {
      newUsername = e.target.value;
    } else if (e.target.name === 'Penn ID') {
      newPennID = e.target.value;
    } else {
      newPassword = e.target.value;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newEmail && newUsername && newPennID && newPassword) {
      const newUser = {
        username: newUsername,
        password: newPassword,
        pennId: newPennID,
        email: newEmail,
      };
      await signupUser(newUser);
      // console.log(response); // to prevent eslint issue
      setJoin(true);
    } else {
      setCredential(false);
    }
  };

  return (
    <div className="main">
      <div className="img-div">
        <img className="login-img" src="/SignUp.svg" alt="" />
      </div>
      <div className="form">
        {join ? (
          <div className="Congrats">
            <Congratulations className="congratsicon" />
            <h1 className="heading">We are glad to have you here!</h1>
            <div className="paragraph">
              <Link className="login" to="/login">Login</Link>
              &nbsp;after verify your email
            </div>
          </div>
        ) : (
          <div className="signup-container">
            <img className="logo" src="/Logo.svg" alt="logo" />
            <div className="line" />
            <div className="slogan">Empowering Students with Affordable Pre-Loved Treasures.</div>
            <FormInputComponent name="Email" type="text" placeholder="example@gmail.com" onChange={handleOnChange} />
            <FormInputComponent name="Username" type="text" placeholder="Adam" onChange={handleOnChange} />
            <FormInputComponent name="Penn ID" type="text" placeholder="12345678" onChange={handleOnChange} />
            <FormInputComponent name="Password" type="password" placeholder="*********" onChange={handleOnChange} />
            <button className="button" type="button" onClick={handleSubmit}>Join the Community!</button>
            {credential ? (
              <p>
                <Link className="back" to="/login">Back to Login</Link>
              </p>
            ) : (
              <CredentialWarningComponent text="Credentials Missing" setCredential={setCredential} />
            )}
          </div>
        )}
        <div className="footer">
          <div className="footer-items">
            <Link to="/charity" className="singleton">About us</Link>
            <Link to="/charity" className="singleton">Contact</Link>
            <Link to="/charity" className="singleton">Donate</Link>
            <Link to="https://www.upenn.edu/" className="singleton">UPenn</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
