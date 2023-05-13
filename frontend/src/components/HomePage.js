import React, { useState, useEffect } from 'react';
import { getLatestProducts } from '../api/productCalls';
import './HomePage.css';
import homepage from '../icons/homepage4.png';
import ProductsGrid from './ProductsGrid';

function HomePage() {
  // fix once we have a backend
  const [postedProducts, setPostedProducts] = useState([]);

  // get posted products from backend
  useEffect(() => {
    const getPostedProductsWrapper = async () => {
      const response = await getLatestProducts();
      if (response != null) {
        const productIds = [];
        response.forEach((product) => {
          const { _id } = product;
          productIds.push(_id);
        });
        setPostedProducts(productIds);
      }
    };
    getPostedProductsWrapper();
  }, [postedProducts.length]);

  /**
   * The homepage should retrieve an array of products from the backend
   * Based on the filters, it should sort the array before .map() it to
   * the <ProductCardSimple/>
   */
  return (
    <div className="home-page-container">
      <div className="home-page-image">
        <img id="homepage-image" src={homepage} alt="homepage" />
      </div>
      <h3 id="popular-products-label">Available Products</h3>
      <ProductsGrid products={postedProducts} />
    </div>
  );
}

export default HomePage;
