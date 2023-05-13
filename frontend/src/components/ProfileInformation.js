import React, { useState } from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfileInformation.css';
import { changeUser } from '../api/user';
import { uploadFile } from '../api/upload';

function ProfileInformation({ user, setUser }) {
  // variables to keep track of entered field values
  let newUsername = '';
  let newPassword = '';
  const [profilePicture, setProfilePicture] = useState('');
  // const hasPicture = useRef(false);
  // let hasPicture = false;
  // const [hasPicture, setHasPicture] = useState(false);

  // change username and password variables when input fields are changed
  const handleOnChange = (e) => {
    if (e.target.id === 'changeUser') {
      newUsername = e.target.value;
    }
    if (e.target.id === 'changePassword') {
      newPassword = e.target.value;
    }
  };

  // // set HasPicture
  // const checkHasPicture = async () => {
  //   if (user.picture !== '') {
  //     // user has a picture
  //     hasPicture = true;
  //   } else {
  //     hasPicture = false;
  //   }
  // };

  // checkHasPicture();

  // make a put request upon click
  const handleOnClick = async () => {
    // check if all fields are empty
    if (newUsername === '' && newPassword === '' && profilePicture === '') {
      // alert('Please enter a new username or password');
      return;
    }

    let url = '';

    // Check that an image has been uploaded
    if (profilePicture !== '') {
      // make call to S3 and get the URL from S3
      const formData = new FormData();

      formData.append(`File_${0}`, profilePicture[0]);

      url = await uploadFile(profilePicture);
    }

    // wrapper for put request
    const changeUserWrapper = async () => {
      try {
        // check which values we have to update
        const newUser = { ...user };
        if (newUsername !== '') {
          newUser.username = newUsername;
        }
        if (newPassword !== '') {
          newUser.password = newPassword;
        }
        if (url !== '') {
          const [picture] = url.data;
          newUser.picture = picture;
        }
        // make put request to update user
        await changeUser(user.pennId, newUser);
        // empty input fields
        document.getElementById('changeUser').value = '';
        document.getElementById('changePassword').value = '';
        document.getElementById('img').value = '';
        // update state
        setUser(newUser);
        setProfilePicture('');
        if (profilePicture !== '') {
          window.location.reload();
        }
      } catch (err) {
        // console.log(err);
      }
    };
    changeUserWrapper();
  };

  const updateImage = (e) => {
    if (e.target.files.length === 1) {
      setProfilePicture(e.target.files);
      // hasPicture = true;
    } else {
      // hasPicture = false;
    }
    // console.log('Updated Image: ', hasPicture);
  };

  // render component
  return (
    <div className="information-main">
      <h1>Profile Information</h1>
      <p>
        Username:&nbsp;
        {user.username}
      </p>
      <input type="text" placeholder="Change Username" id="changeUser" onChange={handleOnChange} />
      <input type="password" placeholder="Change Password" id="changePassword" onChange={handleOnChange} />
      <p>Change Profile Picture</p>
      <input type="file" id="img" name="img" accept="image/*" onChange={(e) => updateImage(e)} />
      <button type="button" className="btn btn-primary" onClick={handleOnClick}>Make Changes</button>
    </div>
  );
}

ProfileInformation.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    pennId: PropTypes.number,
    email: PropTypes.string,
    username: PropTypes.string,
    password: PropTypes.string,
    picture: PropTypes.string,
  }).isRequired,
  setUser: PropTypes.func.isRequired,
};
export default ProfileInformation;
