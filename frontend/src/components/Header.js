import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { getUser } from '../api/userCalls';
import './Header.css';
// import searchIcon from '../icons/Search Icon.svg';
// import { ReactComponent as Dropdown } from '../icons/Hamburger Menu.svg';
// import { ReactComponent as Logo } from '../icons/Logo.svg';
// https://stackoverflow.com/questions/37669391/how-to-get-rid-of-underline-for-link-component-of-react-router
// push
// import defaultIcon from '../icons/default-user-icon.jpg';
import HeaderUpper from './HeaderUpper';
import HeaderCategories from './HeaderCategories';
// https://stackoverflow.com/questions/71892819/how-to-apply-onclick-event-on-svg-file-on-react
// svg and adding onClick

function Header() {
  const [visible, setVisible] = useState(false);

  const handleDropdown = () => {
    setVisible(!visible);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login';
  };

  if (visible === false) {
    return (
      <div className="header-overall-container">
        <HeaderUpper visible={visible} setVisible={setVisible} />
        <HeaderCategories />
      </div>
    );
  }
  return (
    <div className="header-overall-container">
      <HeaderUpper visible={visible} setVisible={setVisible} />
      <HeaderCategories />
      <div className="header-options-parent">
        <div className="header-options">
          <Link to="/user" className="options-class" id="header-myprofile" data-testid="test-myprofile" type="button" onClick={handleDropdown}>My Profile</Link>
          <Link to="/wishlist" className="options-class" id="header-mywishlist" data-testid="test-mywishlist" type="button" onClick={handleDropdown}>My Wishlist</Link>
          <Link to="/charity" className="options-class" id="header-charity" data-testid="test-charity" type="button" onClick={handleDropdown}>Charity</Link>
          <button className="options-class" id="header-logout" data-testid="test-logout" type="button" onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default Header;
