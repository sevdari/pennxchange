import React from 'react';
import PropTypes from 'prop-types';
import './ProfileSidebar.css';
import { Link } from 'react-router-dom';

function ProfileSidebar({
  setActive,
  username,
  profile,
}) {
  // lift up state active to update UserProfile
  function handleOnClick(e) {
    setActive(e.target.id);
  }

  function handleSignout() {
    sessionStorage.clear();
    window.location.href = '/login';
  }

  // render sidebar
  return (
    <div className="sidebar-sidebar">
      <div className="sidebar-profile">
        <img alt="Profile" src={profile} />
        <h3>{username}</h3>
      </div>
      <div className="sidebar-options">
        <div className="sidebar-option">
          <img alt="icon" src="https://cdn-icons-png.flaticon.com/512/456/456212.png" />
          <p>
            <button type="button" id="info" onClick={handleOnClick}> Personal Information </button>
          </p>
        </div>
        <div className="sidebar-option">
          <img alt="icon" src="https://cdn-icons-png.flaticon.com/512/684/684849.png" />
          <p>
            <button type="button" id="wishlist">
              <Link to="/chat">
                Chat
              </Link>
            </button>
          </p>
        </div>
        <div className="sidebar-option">
          <img alt="icon" src="https://cdn-icons-png.flaticon.com/512/838/838534.png" />
          <p>
            <button data-testid="posted" type="button" id="posted" onClick={handleOnClick}>Posted Products</button>
          </p>
        </div>
        <div className="sidebar-option">
          <img alt="icon" src="https://cdn-icons-png.flaticon.com/512/535/535234.png" />
          <p>
            <button type="button" id="wishlist">
              <Link to="/wishlist">
                Wishlist
              </Link>
            </button>
          </p>
        </div>
        <div className="sidebar-option">
          <img alt="icon" src="https://cdn-icons-png.flaticon.com/512/1828/1828479.png" />
          <p>
            <button onClick={handleSignout} type="button" id="signout">Sign Out</button>
          </p>
        </div>
      </div>
    </div>
  );
}
ProfileSidebar.propTypes = {
  setActive: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  profile: PropTypes.string,
};
ProfileSidebar.defaultProps = {
  profile: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
};
export default ProfileSidebar;
