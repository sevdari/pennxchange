import React from 'react';
import { Link } from 'react-router-dom';
import './HeaderCategories.css';

function HeaderCategories() {
  return (
    <div className="header-categories-container">
      <Link className="category-button" id="bathroom-category" to="/search/bathroom">Bathroom</Link>
      <Link className="category-button" id="bedroom-category" to="/search/bedroom">Bedroom</Link>
      <Link className="category-button" id="kitchen-category" to="/search/kitchen">Kitchen</Link>
      <Link className="category-button" id="electronics-category" to="/search/electronics">Electronics</Link>
      <Link className="category-button" id="school-supplies-category" to="/search/school%20supplies">School Supplies</Link>
      <Link className="category-button" id="other-category" to="/search/other">Other</Link>
    </div>
  );
}

export default HeaderCategories;
