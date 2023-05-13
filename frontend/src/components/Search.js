import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SearchFilters from './SearchFilters';
import './Search.css';
import ProductsGrid from './ProductsGrid';
import { searchProduct } from '../api/productCalls';

function Search() {
  const [products, setProducts] = useState([]);
  const { searchTerm } = useParams();

  // for now we mock a DB response as this function will rely heavily on MongoDB
  useEffect(() => {
    const getPostedProductsWrapper = async () => {
      const response = await searchProduct(searchTerm);
      setProducts(response.data);
    };
    getPostedProductsWrapper();
  }, [searchTerm]);
  // filters are passed down to SearchFilters
  const [filters, setFilters] = useState({
    price: 'default',
    time: 'default',
    name: 'default',
    condition: 'default',
  });
  const returnId = (x) => {
    const { _id } = x;
    return _id;
  };

  const idCompare = (a, b) => {
    const aId = returnId(a);
    const bId = returnId(b);
    return aId.localeCompare(bId);
  };

  // rerender when filters change
  useEffect(() => {
    // handles the sorting of the products
    const handleSorting = (a, b) => {
      let priceComparison = 0;
      let nameComparison = 0;
      let timeComparison = 0;
      let conditionComparison = 0;
      // console.log(filters.condition);
      if (filters.price === 'ascending') {
        priceComparison = a.productPrice - b.productPrice;
      } else if (filters.price === 'descending') {
        priceComparison = b.productPrice - a.productPrice;
      }

      if (filters.name === 'ascending') {
        nameComparison = a.productName.localeCompare(b.productName);
      } else if (filters.name === 'descending') {
        nameComparison = b.productName.localeCompare(a.productName);
      }

      if (filters.time === 'ascending') {
        timeComparison = a.productPostedDate.localeCompare(b.productPostedDate);
      } else if (filters.time === 'descending') {
        timeComparison = b.productPostedDate.localeCompare(a.productPostedDate);
      }

      if (filters.condition === 'ascending') {
        conditionComparison = b.productCondition.localeCompare(a.productCondition);
      } else if (filters.condition === 'descending') {
        conditionComparison = a.productCondition.localeCompare(b.productCondition);
      }

      return priceComparison || nameComparison || timeComparison || conditionComparison;
    };
    if (filters.price === 'default' && filters.name === 'default' && filters.condition === 'default' && filters.time === 'default') {
      setProducts((p) => [...p].sort((a, b) => idCompare(a, b)));
    } else {
      setProducts((p) => [...p].sort((a, b) => handleSorting(a, b)));
    }
  }, [filters.price, filters.name, filters.time, filters.condition]);

  const displayProducts = () => {
    if (products.length === 0) {
      return (
        <div className="search-no-products">
          <h1>No products found</h1>
        </div>
      );
    }
    return (
      <div className="search-products">
        <ProductsGrid products={products.map((x) => returnId(x))} />
      </div>
    );
  };

  return (
    <div>
      <div className="search-wrapper">
        <div className="search-header">
          <h1>
            Results for &quot;
            {searchTerm}
            &quot;
          </h1>
        </div>
        <div className="search-main">
          <div className="search-filters">
            <SearchFilters filters={filters} setFilters={setFilters} />
          </div>
          {displayProducts()}
        </div>
      </div>
    </div>
  );
}

export default Search;
