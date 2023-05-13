/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import makeRatingStars from '../utils/RatingStar';
import { getDateString } from '../utils/TimeFunctions';
import { getProduct } from '../api/productCalls';
import { getReviewSeller } from '../api/reviewCalls';
import AddReview from './AddReview';
import ModifyReview from './ModifyReview';
import DeleteReview from './DeleteReview';
import './ReviewsInViewProduct.css';
import { getUserIdFromToken } from '../api/userCalls';

/**
 * This function returns the review block (HTML row element) for the review
 * @param {*} review should contain review.id, review.buyerId,
 * review.rating, review.time, review.content
 * @returns the HTML row element displaying the review
 */
function getReviewBlock(review, userId) {
  // if buyerId is current user, show edit and delete button
  let buttons = null;
  if (review.buyerId === parseInt(userId, 10)) {
    buttons = (
      <div className="row">
        <div className="col-6 col-md-3">
          <ModifyReview reviewId={review._id} />
        </div>
        <div className="col-6 col-md-3">
          <DeleteReview reviewId={review._id} />
        </div>
        {/* <div className="col-6 div-placeholder" /> */}
      </div>
    );
  }

  return (
    <div className="row row-review-block" key={review._id}>
      <div className="col-12">
        <h6>
          <strong>{review.buyerId}</strong>
          &nbsp;&nbsp;
          {makeRatingStars(review.rating)}
        </h6>
        <p key={`${review.id}0`} className="p-review-time">{`Reviewed on: ${getDateString(review.time)}`}</p>
        <p key={`${review.id}1`}>{review.content}</p>
      </div>
      <div className="col-12">{buttons}</div>
      <hr className="review-block-divider" />
    </div>
  );
}

/**
 * Given product id, get the sellers' reviews
 * @param {*} productId the id of the product to get reviews
 * @returns the components containing reviews of the product
 */
function ReviewsInViewProduct({ productId }) {
  // get the reviews from api
  // 1. get seller id, 2. get seller's reviews
  const [reviews, setReviews] = useState(null);
  const [userId, setUserId] = useState(null);
  const sellerId = useRef(null);
  useEffect(() => {
    const getAllInfo = async () => {
      const prodResponse = await getProduct(productId);
      sellerId.current = prodResponse.productSeller;

      const reviewResponse = await getReviewSeller(sellerId.current);
      setReviews(reviewResponse);
      const userResponse = await getUserIdFromToken(sessionStorage.getItem('app-token'));
      if (userResponse) {
        setUserId(parseInt(userResponse.data, 10));
      }
    };

    getAllInfo();
  }, [productId, userId]);

  // when reviews are not fetched yet
  if (!reviews) return null;
  return (
    <div className="container view-product-no-align">
      <div className="row">
        <div key={0} className="col-6 col-md-8">
          <h3 className="review-title-h3">Seller&apos;s Credibility Review</h3>
          {reviews.map((review) => getReviewBlock(review, userId))}
        </div>
        <div key={1} className="col-6 col-md-4">
          <h3>Review this product</h3>
          <p>Share your thoughts with other customers!</p>
          {userId && <AddReview idBuyer={userId} idSeller={sellerId.current} />}
        </div>
      </div>
    </div>
  );
}

ReviewsInViewProduct.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default ReviewsInViewProduct;
