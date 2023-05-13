import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { modifyReview, getReview } from '../api/reviewCalls';

function ModifyReview({ reviewId }) {
  const [showModal, setShowModal] = useState(false);
  const [newReview, setReview] = useState('');
  const idBuyer = useRef(0);
  const idSeller = useRef(0);
  const [newRating, setRating] = useState(0);
  const reviewObject = useRef({});

  useEffect(() => {
    const getReviewWrapper = async () => {
      const review = await getReview(reviewId);
      reviewObject.current = review;
      setReview(review.content);
      setRating(review.rating);
      idBuyer.current = review.buyerId;
      idSeller.current = review.sellerId;
    };
    getReviewWrapper();
  }, [showModal, reviewId]);

  const handleOnChange = (e) => {
    if (e.target.id === 'review') {
      setReview(e.target.value);
    } else if (e.target.id === 'rating') {
      setRating(e.target.value);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (newReview && newRating) {
      const newReviewComplete = {
        content: newReview,
        rating: newRating,
        buyerId: idBuyer.current,
        sellerId: idSeller.current,
        time: new Date().toISOString(),
      };
      await modifyReview(reviewId, newReviewComplete);
    }
    handleCloseModal();
    window.location.reload();
  };

  return (
    <div className="container">
      <button type="button" className="btn btn-outline-* modify-review-button" data-testid="edit-review-button" onClick={handleShowModal}>
        Edit Review
      </button>

      {showModal && (
        <div className="modal d-block" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-modal="true" role="dialog">
          <div className="modal-dialog" data-testid="review-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Edit Review</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal} />
              </div>
              <div className="modal-body">
                <h2> Review: </h2>
                <textarea className="form-control" rows="7" placeholder="Write your new review here" id="review" name="review" value={newReview} onChange={handleOnChange} />
                <p style={{ float: 'left', fontWeight: 'bold', textAlign: 'center' }}>
                  Rating:
                  <select className="form-select" aria-label="Default select example" id="rating" name="rating" data-testid="edit-rating" value={newRating} onChange={handleOnChange}>
                    <option value="0"> 0 </option>
                    <option value="1"> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> 5 </option>
                  </select>
                </p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal} data-testid="edit-close">
                  Close
                </button>
                <button type="button" className="btn btn-primary" data-testid="edit-save" onClick={handleSaveReview}>
                  Save Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ModifyReview.propTypes = {
  reviewId: PropTypes.string.isRequired,
};

export default ModifyReview;
