import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { addReview } from '../api/reviewCalls';
import './AddReview.css';

function AddReview({ idBuyer, idSeller }) {
  const [showModal, setShowModal] = useState(false);

  let newReview;
  let newRating;

  const handleOnChange = (e) => {
    if (e.target.id === 'review') {
      newReview = e.target.value;
    } else if (e.target.id === 'rating') {
      newRating = e.target.value;
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddReview = async (e) => {
    // Handle adding review to database here
    e.preventDefault();
    // console.log('current time:', new Date().toISOString());
    if (newReview && newRating) {
      const newCompleteReview = {
        buyerId: idBuyer,
        sellerId: idSeller,
        content: newReview,
        rating: parseInt(newRating, 10),
        time: new Date().toISOString(),
      };
      // const resp = await addReview(newCompleteReview);
      await addReview(newCompleteReview);
      // console.log(resp);
    }
    handleCloseModal();
    window.location.reload();
  };

  return (
    <div className="container">
      <button type="button" className="btn btn-outline-* add-review-button" onClick={handleShowModal} data-testid="add-review-button">
        Add Review
      </button>

      {showModal && (
        <div className="modal d-block" id="add-review-modal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-modal="true" role="dialog">
          <div className="modal-dialog" data-testid="review-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5">Add Review</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal} />
              </div>
              <div className="modal-body">
                <h2> Review: </h2>
                <textarea className="form-control" rows="7" placeholder="Write your review here" id="review" onChange={handleOnChange} data-testid="review-input" />
                <p style={{ float: 'left', fontWeight: 'bold', textAlign: 'center' }}>
                  Rating:
                  <select className="form-select" aria-label="Default select example" id="rating" onChange={handleOnChange} data-testid="review-rating">
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
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal} data-testid="close-modal-button">
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleAddReview} data-testid="submit-review-button">
                  Add Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

AddReview.propTypes = {
  idBuyer: PropTypes.number.isRequired,
  idSeller: PropTypes.number.isRequired,
};

export default AddReview;
