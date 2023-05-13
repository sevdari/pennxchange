import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ProductCardDetailed from './ProductCardDetailed';
import { getSimilarProducts } from '../api/productCalls';
import './SimilarProducts.css';

/**
 * Display (at most 4) similar products given product id
 * Usage: <SimilarProducts productId={the i}>
 * @param {*} productId the id of the product to get similar products with
 * @returns The SimilarProducts component
 */
function SimilarProducts({ productId }) {
  // get the similar product list from api
  const [similarProducts, setSimilarProducts] = useState([]);
  useEffect(() => {
    const getProductInfo = async () => {
      const response = await getSimilarProducts(productId);
      if (response) {
        setSimilarProducts(response);
      }
    };
    getProductInfo();
  }, [productId, similarProducts.length]);

  // not fetched yet, return null
  if (!similarProducts) {
    return null;
  }
  const getPrivateId = (x) => {
    const { _id } = x;
    return _id;
  };
  if (similarProducts.length === 0) {
    return (
      <div className="container view-product-no-align">
        <h3>Similar Products</h3>
        <div className="row gx-3 similar-product-no-res">
          <h4>Oops, no suggestions found.</h4>
        </div>
      </div>
    );
  }
  return (
    <div className="container view-product-no-align">
      <h3>Similar Products</h3>
      <div className="row gx-3">
        {
          similarProducts.map((element) => (
            // eslint-disable-next-line no-underscore-dangle
            <ProductCardDetailed key={getPrivateId(element)} productId={getPrivateId(element)} />))
        }
      </div>
    </div>
  );
}

SimilarProducts.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default SimilarProducts;
