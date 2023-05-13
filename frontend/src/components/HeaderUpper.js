import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import './HeaderUpper.css';
import searchIcon from '../icons/Search Icon.svg';
import { ReactComponent as Dropdown } from '../icons/Hamburger Menu.svg';
import { ReactComponent as Logo } from '../icons/Logo.svg';
import defaultIcon from '../icons/default-user-icon.jpg';
import { getUserIdFromToken, getUser } from '../api/userCalls';

function HeaderUpper({ visible, setVisible }) {
//   const [visible, setVisible] = useState(false);
  const [userIcon, setUserIcon] = useState('');
  const navigate = useNavigate();
  let searchTerm;

  const handleOnChange = (e) => {
    searchTerm = e.target.value;
  };

  // get image from backend using wrapper
  useEffect(() => {
    const getImageWrapper = async () => {
      const responseRaw = await getUserIdFromToken(sessionStorage.getItem('app-token')).then(
        (response) => getUser(response.data),
      );
      if (responseRaw && responseRaw.data) {
        if (responseRaw.data.picture === '') {
          setUserIcon(defaultIcon);
        } else {
          setUserIcon(responseRaw.data.picture);
        }
      }
    };
    getImageWrapper();
  }, [userIcon]);

  // const getImage = async () => {
  //   const responseRaw = await getUser(userId);
  //   const response = responseRaw.data;
  //   if (response.picture === '') {
  //     setUserIcon(defaultIcon);
  //   } else {
  //     setUserIcon(response.picture);
  //   }
  // };

  // getImage();

  const handleDropdown = () => {
    setVisible(!visible);
  };

  const handleSearch = () => {
    // console.log('Search handled!');
    if (searchTerm) {
      navigate(`/search/${searchTerm}`);
    }
  };

  return (
    <div id="header-page-container">
      <div id="header-header">
        <Link to="/home" type="button" id="header-logo" data-testid="header-logo-svg">
          <Logo width="200px" alt="logo" role="button" />
        </Link>
        <div id="header-searchbar">
          <input id="header-search-input" type="text" placeholder="Search" onChange={handleOnChange} />
          <button type="button" id="header-searchicon" data-testid="header-searchicon-svg" onClick={handleSearch}>
            <img id="searchicon" src={searchIcon} width="25px" height="25px" alt="search-icon" />
          </button>
        </div>
        <Link to="/user" id="user-button" type="button" width="40px">
          <img id="header-usericon" src={userIcon} alt="user" width="50px" />
        </Link>
        <button type="button" id="header-dropdown" data-testid="header-dropdown-svg" onClick={handleDropdown}>
          <Dropdown width="30px" height="30px" role="button" onClick={handleDropdown} />
        </button>
      </div>
    </div>
  );
}

HeaderUpper.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
};

export default HeaderUpper;
