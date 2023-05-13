import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ProductDetail.css';
import { dayDifference } from '../utils/TimeFunctions';
import OutlineButton from './OutlineButton';
import { PennBlue } from '../utils/Colors';
import { getProduct } from '../api/productCalls';
import { getUser, getUserIdFromToken } from '../api/userCalls';
import { getWishlist } from '../api/wishlistCalls';
import AddToWishlist from './AddToWishlist';
import { addMessage } from '../api/message';

/**
 * Get the carousel images
 * @param {*} productImage the array of image urls
 * @param {*} activeIndex the index of the active image
 * @returns the nodes of carousel images
 */
function getCarouselItems(productImage, activeIndex) {
  return productImage.map((image, index) => (
    <div data-testid={`carouselProductDetail${index}`} className={`carousel-item ${index === activeIndex ? 'active' : ''}`} key={image}>
      <img src={image} className="d-block w-100" alt={`Product ${index}`} />
    </div>
  ));
}

/**
 * Get the carousel indicator buttons
 * @param {*} productImage the array of image urls
 * @param {*} activeIndex the index of the active image
 * @param {*} setActiveIndex the handler to set the active index
 * @returns the nodes of carousel indicator buttons
 */
function getCarouseIndicators(productImage, activeIndex, setActiveIndex) {
  return productImage.map((image, index) => (
    <button
      type="button"
      data-bs-target="#carouselWrapper"
      data-bs-slide-to={index}
      className={index === activeIndex ? 'active' : ''}
      aria-current={index === activeIndex ? 'true' : 'false'}
      onClick={() => setActiveIndex(index)}
      key={image}
      aria-label={`Slide ${index + 1}`}
    />
  ));
}

/**
 * A component to display the product details,
 * left side is the images of the product, right side is the product details
 * @param productId The id of the product to display
 * @returns The productDetail component
 */
function ProductDetail({ productId }) {
  // get the product details from api
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState('');
  const [inWishlist, setInWishlist] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // userId is decoded from session
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getProductInfo = async () => {
      const response = await getProduct(productId);
      setProduct(response);

      const sellerResponse = await getUser(response.productSeller);
      setSeller(sellerResponse.data);

      // get userId from session
      const userResponse = await getUserIdFromToken(sessionStorage.getItem('app-token'));
      if (userResponse) {
        setUserId(userResponse.data);

        // check if the product is in the user's wishlist
        const wishlist = await getWishlist(userResponse.data);
        // currently hard-coded to 12312312, will replace with userId once session is implemented
        if (wishlist.some((item) => item === productId)) {
          setInWishlist(true);
        } else {
          setInWishlist(false);
        }
      }
    };
    getProductInfo();
  }, [productId, userId]);

  // Track the index of the active image
  // otherwise, react will not re-render the carousel
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle the previous and next button click
  const handlePrevClick = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex === 0 ? product.productImage.length - 1 : prevIndex - 1),
    );
  };

  const handleNextClick = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex === product.productImage.length - 1 ? 0 : prevIndex + 1),
    );
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSendMessage = async () => {
    const message = document.getElementById('contact-seller').value;
    const time = new Date();
    const newMessage = {
      content: message,
      time: time.toISOString(),
      sender: userId,
      receiver: seller.pennId,
    };
    await addMessage(newMessage);
    document.getElementById('contact-seller').value = '';
    handleCloseModal();
  };

  // If the product or user is not loaded, return null
  if (!product || !userId) return null;
  return (
    <div>
      <div className="container view-product-no-align">
        <div className="row" id="row-product-detail">
          <div className="col-12 col-md-5">
            <div id="carouselWrapper" className="carousel slide" data-bs-ride="carousel" data-bs-interval="false">
              <div className="carousel-indicators">
                {getCarouseIndicators(product.productImage, activeIndex, setActiveIndex)}
              </div>
              <div className="carousel-inner">
                {getCarouselItems(product.productImage, activeIndex)}
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselWrapper"
                data-bs-slide="prev"
                onClick={handlePrevClick}
              >
                <span className="carousel-control-prev-icon" aria-hidden="true" />
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselWrapper"
                data-bs-slide="next"
                onClick={handleNextClick}
              >
                <span className="carousel-control-next-icon" aria-hidden="true" />
                <span className="visually-hidden">Next</span>
              </button>
            </div>

            <div id="div-postDate">
              <p>{`Posted: ${dayDifference(product.productPostedDate)}`}</p>
            </div>
          </div>

          <div className="col-12 col-md-7">
            <div className="card" id="card-product-detail">
              <div className="card-body" id="card-body-product-detail">
                <h3 className="card-title" id="card-title-product-detail">{product.productName}</h3>
                <h4 className="card-subtitle mb-2 text-muted" id="card-subtitle-product-detail">
                  $
                  {product.productPrice}
                </h4>

                <p className="card-text card-text-product-detail">
                  <strong>Product Description</strong>
                  <br />
                  {product.productDescription}
                </p>

                <p className="card-text card-text-product-detail">
                  <strong>Product Condition</strong>
                  <br />
                  {product.productCondition}
                </p>

                <p className="card-text card-text-product-detail">
                  <strong>Seller Information</strong>
                  <br />
                  {seller.username}
                </p>

                <div className="contact-and-wishlist buttons">
                  <OutlineButton text="Contact Seller" color={PennBlue} handleOnClick={handleOpenModal} data-toggle="modal" data-target="#exampleModal" />
                  <br />

                  <br />

                  <AddToWishlist
                    className="addToWishlistButton"
                    inWishlist={inWishlist}
                    setInWishlist={setInWishlist}
                    idProduct={productId}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      { showModal && (
        <div className="modal d-block" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Contact Seller</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal} />
              </div>
              <div className="modal-body">
                <textarea className="form-control" rows="7" placeholder="Write your message here" id="contact-seller" data-testid="contact-input" />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleCloseModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSendMessage}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ProductDetail.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default ProductDetail;
