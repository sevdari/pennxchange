import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getWishlist } from '../api/wishlistCalls';
import { getAllProducts } from '../api/productCalls';
import './WishlistPage.css';
import ProductCardWishlist from './ProductCardWishlist';
import ProductsGrid from './ProductsGrid';
import { getUserIdFromToken } from '../api/userCalls';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length
// https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript

function WishlistPage({ id }) {
  // fix once we have a backend
  const [postedProducts, setPostedProducts] = useState([]);

  // get userId from session, if props is not passed
  // userId is set to a state as it triggers generation of wishlistComponents
  const [userId, setUserId] = useState(id);

  // get posted products from backend
  useEffect(() => {
    const getPostedProductsWrapper = async () => {
      const response = await getAllProducts();
      const productIds = [];
      response.forEach((product) => {
        const { _id } = product;
        productIds.push(_id);
      });
      setPostedProducts(productIds);
    };
    getPostedProductsWrapper();
  }, []);

  const [wishlistComponents, setWishlistComponents] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const getWishlistItems = async () => {
      // get userId from session
      const resp = await getUserIdFromToken(sessionStorage.getItem('app-token'));
      if (!userId && resp) {
        setUserId(resp.data);
      }
      // only get wishlist if userId is fetched
      if (!userId) {
        return;
      }
      // get wishlist from api
      const response = await getWishlist(userId);
      setWishlist(response);
      // generate wishlistComponent
      setWishlistComponents(wishlist.map((productId) => (
        <ProductCardWishlist
          productId={productId}
          wishlist={wishlist}
          setWishlist={setWishlist}
          userId={parseInt(userId, 10)}
          key={productId}
        />
      )));
    };
    getWishlistItems();
  }, [wishlist.length, userId]);

  // special case when userId not retrieved
  if (!userId) {
    return null;
  }

  if (wishlist.length === 0) {
    return (
      <div>
        <div className="wishlist-page-container">
          <h1 id="wishlist-heading">My Wishlist</h1>
          <div className="wishlist-oops-container">
            <h2 id="wishlist-oops-container-1">Oops!</h2>
            <h3 id="wishlist-oops-container-2">It seems you have no product in your Wishlist.</h3>
          </div>
          <h2 id="you-may-also-like">You may also like...</h2>
          <ProductsGrid products={postedProducts} />
        </div>
      </div>
    );
  }
  return (
    <div>
      <div className="wishlist-page-container">
        <h1 id="wishlist-heading">My Wishlist</h1>
        <div className="wishlist-items">
          {wishlistComponents}
        </div>
      </div>
    </div>
  );
}

WishlistPage.propTypes = {
  id: PropTypes.number,
};

WishlistPage.defaultProps = {
  id: null,
};

export default WishlistPage;
