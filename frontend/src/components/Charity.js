import React from 'react';
import './Charity.css';
import donateImage from '../assets/donate-img.png';
import zelleImage from '../assets/donation-zelle-img.png';

function Charity() {
  return (
    <div>
      <div className="container" id="donate-container">
        <div className="row">
          <div className="col-12 col-md-6">
            <h1 className="display-5">About PennXchange</h1>
            <p>
              PennXchange is a platform created and maintained
              by students at the University of Pennsylvania.
              We are proudly non-profit, non-corporate, and non-compromised.
              Our mission is to empower students with affordable pre-loved treasures.
            </p>

            <br />

            <h1 className="display-5">SMALL ACTIONS</h1>
            <h1 className="display-6 text-muted">creating huge impacts on the community</h1>
            <p>
              To enhance a smoother user experience and maintain/update the website
              at the timely manner, we would love to receive donations from our community!
              Thousands of people like you help us to where we are at today!
              Your kindness will motivate us to provide ongoing, long-term high-quality
              service to all of you.
            </p>

            <br />

            <div className="container">
              <div className="row">
                <div className="col-4">
                  <img src={zelleImage} alt="zelle logo" id="zelle-logo" />
                </div>
                <div className="col-8" id="payment-info-div">
                  <p><strong>Payment Information</strong></p>
                  <p>
                    Email Address:&nbsp;
                    <a href="mailto:pennnxchange@gmail.com">pennnxchange@gmail.com</a>
                  </p>
                  <p>
                    Phone Number: +1 (100) 100-0000
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-1" />

          <div className="col-12 col-md-5" id="donate-image-wrapper">
            <img src={donateImage} alt="donate!" id="donate-img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charity;
