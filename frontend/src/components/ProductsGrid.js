import React from 'react';
import PropTypes from 'prop-types';
import ProductCardSimple from './ProductCardSimple';
import './ProductsGrid.css';

function ProductsGrid({
  products, productsModifiable, handleDeleteProduct,
}) {
  // if modifiable is true, check if handleDeleteProduct is passed
  if (productsModifiable && !handleDeleteProduct) {
    throw new Error('handleDeleteProduct is required if modifiable is true');
  }

  const productComponents = [];
  products.forEach((product) => {
    productComponents.push(
      <ProductCardSimple
        productId={product}
        modifiable={productsModifiable}
        handleDeleteProduct={() => handleDeleteProduct(product)}
        key={product}
      />,
    );
  });

  return (
    <div className="grid-products">
      {productComponents}
    </div>
  );
}

ProductsGrid.propTypes = {
  products: PropTypes.arrayOf(PropTypes.string).isRequired,
  productsModifiable: PropTypes.bool,
  handleDeleteProduct: PropTypes.func,
};

ProductsGrid.defaultProps = {
  productsModifiable: false,
  handleDeleteProduct: null,
};

export default ProductsGrid;
