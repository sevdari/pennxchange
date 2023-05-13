import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';

/**
* This function returns the footer which contains 4 text that act as buttons
* that redirect the user to different pages
* Resource for linking UPenn: https://codingbeautydev.com/blog/react-button-link/#:~:text=To%20use%20a%20button%20as%20a%20link%20in%20React%2C%20wrap,navigate%20to%20the%20specified%20URL.
* @params - None
* @returns - The Footer Componet
*/

function Footer() {
  return (
    <div id="footer">
      <Link to="/charity" className="footerText" id="About Us" type="button">About Us</Link>
      <Link to="/charity" className="footerText" id="Contact" type="button">Contact</Link>
      <Link to="/charity" className="footerText" id="Donate" type="button">Donate</Link>
      <a href="https://www.upenn.edu">
        <button className="footerText" id="UPenn" type="button">UPenn</button>
      </a>
    </div>
  );
}

export default Footer;
