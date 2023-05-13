import React from 'react';

// AddReviewBox component

function AddReviewBox() {
  return (

    <div
      className="card col-6 col-md-3"
      role="button"
      tabIndex="0"
      style={{ margin: 'auto', marginTop: '10px' }}
    >
      <div className="card-body">
        <h4 className="card-title">Review this product</h4>
        <h6 className="card-text" style={{ float: 'right', fontWeight: 'bold', textAlign: 'left' }}>
          Share your thoughts with other customers
        </h6>
        <button type="button" className="btn btn-outline-primary">Write a customer review</button>
      </div>
    </div>
  );
}

export default AddReviewBox;
