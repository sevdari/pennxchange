import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProduct } from '../api/productCalls';
import { dayDifference } from '../utils/TimeFunctions';
import OutlineButton from './OutlineButton';
import { PennBlue, PennRed } from '../utils/Colors';
import './ProductCardSimple.css';

/**
 * This is the product card with simple product info
 * used in mainPage, etc.
 * If modifiable is true, modify and delete buttons will be displayed,
 * and the caller is responsible for handling the button clicks
 * Usage: <ProductCardSimple productId={id of product to display} />
 *
 * @param {number} props.productId - the id of the product to display
 * @param {boolean} props.modifiable - whether the product is modifiable,
 * if true, modify and delete buttons will be displayed
 * @param {function} props.handleDeleteProduct - function to handle delete button click,
 * required if modifiable is true
 * @returns a simple product card with given id
 */
function ProductCardSimple({
  productId, modifiable, handleDeleteProduct,
}) {
  // if modifiable is true, check if handleDeleteProduct is passed
  if (modifiable && !handleDeleteProduct) {
    throw new Error('handleDeleteProduct is required if modifiable is true');
  }

  // get product info from backend
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProductInfo = async () => {
      const response = await getProduct(productId);
      setProduct(response);
    };
    getProductInfo();
  }, [productId]);

  const navigate = useNavigate();
  const handleModifyProduct = async () => {
    navigate(`/modifyProduct/${productId}`);
  };

  // wait for useEffect to execute, otherwise product is null
  if (!product) return null;
  return (
    <div
      data-testid="product-card-simple-container"
      className="card col-6 col-md-3"
    >
      <Link to={`/product/${productId}`} className="product-card-simple-link">
        <img src={product.productImage[0]} className="card-img-top" alt={product.productName} />
        <div className="card-body">
          <h4 className="card-title">{product.productName}</h4>
          <h5 className="card-text product-card-left-align product-card-bold">
            $
            {product.productPrice}
          </h5>
          <p className="card-text product-card-left-align">
            <small className="text-muted">
              Posted:&nbsp;
              {dayDifference(product.productPostedDate)}
            </small>
          </p>
        </div>
      </Link>
      {
        !modifiable ? null : (
          <div className="row card-simple-buttons-row">
            <div className="col-12 col-sm-6">
              <OutlineButton text="Modify" color={PennBlue} handleOnClick={handleModifyProduct} />
            </div>
            <div className="col-12 col-sm-6">
              <OutlineButton text="Delete" color={PennRed} handleOnClick={handleDeleteProduct} />
            </div>
          </div>
        )
      }
    </div>
  );
}
ProductCardSimple.propTypes = {
  productId: PropTypes.string.isRequired,
  modifiable: PropTypes.bool,
  handleDeleteProduct: PropTypes.func,
};

ProductCardSimple.defaultProps = {
  modifiable: false,
  handleDeleteProduct: null,
};

export default ProductCardSimple;
