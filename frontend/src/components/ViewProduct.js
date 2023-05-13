import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import ProductDetail from './ProductDetail';
import SimilarProducts from './SimilarProducts';
import ReviewsInViewProduct from './ReviewsInViewProduct';
// import ReviewsInViewProduct from './ReviewsInViewProduct';
import './ViewProduct.css';

// TODO: add reviews and fix CSS.
function ViewProduct({ id }) {
  // get productId from url, if not given in props
  let productId = id;
  // const { userInParam } = useParams();
  // const userId = parseInt(userInParam, 10);

  const { productIdInParam } = useParams();
  productId = productIdInParam;
  if (id != null) {
    productId = id;
  }

  return (
    <div>
      <div className="container" id="div-view-product-wrapper">
        <ProductDetail productId={productId} />

        <hr key={0} className="view-product-divider" />
        <SimilarProducts productId={productId} />

        <hr key={1} className="view-product-divider" />
        <ReviewsInViewProduct productId={productId} />

      </div>
    </div>
  );
}

ViewProduct.propTypes = {
  id: PropTypes.string,
};

ViewProduct.defaultProps = {
  id: null,
};

export default ViewProduct;
