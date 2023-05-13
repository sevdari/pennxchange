import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
// import makeRatingStars from '../utils/RatingStar';
import { getProduct } from '../api/productCalls';
import { dayDifference } from '../utils/TimeFunctions';
import './ProductCardDetailed.css';

/**
 * This is the product card with detailed product info
 * used in searchProduct, similarProducts, etc.
 * Usage: <ProductCardDetailed productId={the id of product} />
 *
 * @param {*} props - productId: the id of product to be displayed
 * @returns a detailed product card with given id
 */
function ProductCardDetailed({ productId }) {
  // get product info from backend
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const getProductInfo = async () => {
      const response = await getProduct(productId);
      setProduct(response);
    };
    getProductInfo();
  }, [productId]);

  // make star rating
  // const starString = makeRatingStars(rating);

  // wait for useEffect to execute, otherwise product is null
  if (!product) return null;
  return (
    <div className="col-6 col-md-3">
      <Link to={`/product/${productId}`} className="product-card-detailed-link">
        <div
          className="card product-card-detailed-card"
        >
          <img src={product.productImage[0]} className="card-img-top detail-card-img" alt={product.productName} />
          <div className="card-body">
            <h5 className="card-title">{product.productName}</h5>
            <p className="card-text">{product.productDescription}</p>
            {/* <p className="card-text">{starString}</p> */}
            <h5 className="card-text card-bold-text">
              $
              {product.productPrice}
            </h5>
            <p className="card-text card-right-align-text">
              <small className="text-muted">
                Posted:&nbsp;
                {dayDifference(product.productPostedDate)}
              </small>
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
ProductCardDetailed.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default ProductCardDetailed;
