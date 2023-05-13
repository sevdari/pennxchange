import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import OutlineButton from './OutlineButton';
import { PennBlue, PennRed } from '../utils/Colors';
import { getProduct } from '../api/productCalls';
import { dayDifference } from '../utils/TimeFunctions';
import { deleteFromWishlist } from '../api/wishlistCalls';
import './ProductCardWishlist.css';

/**
 * This is the horizontal product card used in wishlist.
 * Usage: <ProductCardWishlist productId={the id of product}
 * wishlist={wishlist state} setWishlist={setter of wishlist state}
 * userId={the userId of this wishlist} />
 *
 * @param {*} props - productId, wishlist, setWishList, userId
 * @returns a horizontal product card with given props, used in Wishlist
 */
function ProductCardWishlist({
  productId, wishlist, setWishlist, userId,
}) {
  // get product info from backend
  const [product, setProduct] = useState(null);
  useEffect(() => {
    const getProductInfo = async () => {
      const response = await getProduct(productId);
      setProduct(response);
    };
    getProductInfo();
  }, [productId]);

  // handle delete product button
  const handleDeleteProduct = () => {
    const newWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(newWishlist);
    deleteFromWishlist(userId, productId);
  };

  // wait for useEffect to execute, otherwise product is null
  if (!product) return null;
  return (
    <div className="card mb-3 wishlist-card-wrappers">
      <div className="row g-0">
        <div className="col-md-4 wishlist-card-img-div">
          <img src={product.productImage[0]} alt={product.productName} />
        </div>
        <div className="col-md-5 wishlist-card-middle-div">
          <div className="card-body">
            <h4 className="card-title">{ product.productName }</h4>
            <p className="card-text">{ product.productDescription }</p>
            <p className="card-text">
              <small className="text-muted">
                Seller:&nbsp;
                { product.productSeller }
                <br />
                Added to list:&nbsp;
                { dayDifference(product.productPostedDate) }
              </small>
            </p>
          </div>
        </div>
        <div className="col-md-3 wishlist-card-right-div">
          <div className="wishlist-card-view-button">
            <Link to={`/product/${productId}`}>
              <OutlineButton text="View Product" color={PennBlue} handleOnClick={() => {}} />
            </Link>
          </div>
          <div className="wishlist-card-delete-button">
            <OutlineButton text="Delete from List" color={PennRed} handleOnClick={handleDeleteProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}
ProductCardWishlist.propTypes = {
  productId: PropTypes.string.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.string).isRequired,
  setWishlist: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default ProductCardWishlist;
