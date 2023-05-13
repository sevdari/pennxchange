import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProfilePostedProducts.css';
import PropTypes from 'prop-types';
import ProductsGrid from './ProductsGrid';
import { getPostedProducts, deleteProduct } from '../api/productCalls';

function ProfilePostedProducts({ userId }) {
  const [postedProducts, setPostedProducts] = useState([]);

  // get posted products from backend
  useEffect(() => {
    const getPostedProductsWrapper = async () => {
      const response = await getPostedProducts(userId);
      setPostedProducts(response);
    };
    getPostedProductsWrapper();
  }, []);

  // handler when seller deletes posted product
  const handleDeleteProduct = async (productId) => {
    setPostedProducts(postedProducts.filter((product) => product !== productId));
    // call api to delete product
    await deleteProduct(productId);
  };

  return (
    <div data-testid="posted-product-page" className="profile-posted-products-wrapper">
      <h1>Posted Products</h1>
      <div className="posted-add">
        <hr style={{
          color: '#000000',
          backgroundColor: '#000000',
          height: 0.5,
          borderColor: '#000000',
        }}
        />
        <button type="button" className="btn btn-primary posted-btn">
          <Link to="/addProduct" type="button">
            &#x2b;
          </Link>
        </button>
        <hr style={{
          color: '#000000',
          backgroundColor: '#000000',
          height: 0.5,
          borderColor: '#000000',
        }}
        />
      </div>
      <ProductsGrid
        products={postedProducts}
        productsModifiable
        handleDeleteProduct={handleDeleteProduct}
      />
    </div>
  );
}

ProfilePostedProducts.propTypes = {
  userId: PropTypes.number.isRequired,
};

export default ProfilePostedProducts;
