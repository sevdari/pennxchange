import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { deleteReview } from '../api/reviewCalls';

function DeleteReview({ reviewId }) {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteReview = async () => {
    await deleteReview(reviewId);
    handleCloseModal();
    window.location.reload();
  };

  return (
    <div className="container">
      <button type="button" className="btn btn-outline-* delete-review-button" onClick={handleShowModal} data-testid="add-review-button">
        Delete Review
      </button>

      {showModal && (
        <div
          className="modal d-block"
          id="staticBackdropLive"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLiveLabel"
          style={{ display: 'block' }}
          aria-modal="true"
          role="dialog"
          data-testid="review-modal"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLiveLabel">
                  Delete Review
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal} />
              </div>
              <div className="modal-body">
                <h5>Are you sure you want to delete this review?</h5>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal} data-testid="delete-close">
                  Close
                </button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteReview}>
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

DeleteReview.propTypes = {
  reviewId: PropTypes.string.isRequired,
};

export default DeleteReview;
