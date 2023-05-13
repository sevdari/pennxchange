import propTypes from 'prop-types';
import './SearchFilters.css';
import { React, useRef, useEffect } from 'react';
import { PennBlue, PennRed } from '../utils/Colors';

function SearchFilters({ filters, setFilters }) {
  // store the colors of the filters
  const colors = useRef({
    price: PennBlue,
    time: PennBlue,
    name: PennBlue,
    condition: PennBlue,
  });
  // handle the color rendering of the filters
  const handleColors = () => {
    Object.keys(colors.current).forEach((key) => {
      const currentFilter = document.getElementById(`filters-${key}`);
      if (currentFilter) {
        currentFilter.style.borderColor = colors.current[key];
        currentFilter.style.color = colors.current[key];
      }
    });
  };
  // assign colors on each render
  useEffect(() => {
    handleColors();
  });
  // yet another color function? hell yeah!
  const handleColorChange = (value, filter) => {
    if (value === 'ascending') {
      colors.current[filter] = 'green';
    } else if (value === 'descending') {
      colors.current[filter] = PennRed;
    } else {
      colors.current[filter] = PennBlue;
    }
  };
  // lift state up to the parent component
  const handleOnChange = (e) => {
    const { id, value } = e.target;
    const filter = id.split('-')[1];
    const newFilters = { ...filters };
    newFilters[filter] = value;
    handleColorChange(value, filter);
    setFilters(newFilters);
  };

  return (
    <div className="full-width">
      <div className="filters-wrapper">
        <select defaultValue="default" className="form-select filters-filter" aria-label="Default select example" id="filters-price" onChange={handleOnChange}>
          <option value="default">Sort by Price</option>
          <option value="ascending">Price: Low to High</option>
          <option value="descending">Price: High to Low</option>
        </select>

        <select defaultValue="default" className="form-select filters-filter" aria-label="Default select example" id="filters-time" onChange={handleOnChange}>
          <option value="default">Sort by Time</option>
          <option value="ascending">Oldest to Newest</option>
          <option value="descending">Newest to Oldest</option>
        </select>

        <select defaultValue="default" className="form-select filters-filter" aria-label="Default select example" id="filters-name" onChange={handleOnChange}>
          <option value="default">Sort by Name</option>
          <option value="ascending">A-Z</option>
          <option value="descending">Z-A</option>
        </select>

        <select defaultValue="default" className="form-select filters-filter" aria-label="Default select example" id="filters-condition" onChange={handleOnChange}>
          <option value="default">Filter by Condition</option>
          <option value="ascending">Used to New</option>
          <option value="descending">New to Used</option>
        </select>
      </div>
    </div>
  );
}

SearchFilters.propTypes = {
  filters: propTypes.objectOf(propTypes.string).isRequired,
  setFilters: propTypes.func.isRequired,
};

export default SearchFilters;
