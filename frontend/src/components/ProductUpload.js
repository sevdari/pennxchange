import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './ProductUpload.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { makeProduct, getProduct, updateProduct } from '../api/productCalls';
import { getUserIdFromToken } from '../api/userCalls';
import { uploadFile } from '../api/upload';

/**
 * This is the product upload/modify page.
 * Note that if no props are passed, parameters will be retrieved from url
 * Usage: <ProductUpload idSeller={seller id} [productId={product id to update}] [modify]/>
 * @param {number} props.sellerId - the id of the seller, optional if params in url
 * @param {number} props.productId - the id of the product to update, optional if params in url
 * @param {boolean} props.modify - true the page is for modifying a product
 *
 * @returns a product upload/modify page
 */
function ProductForm({ sellerId, productId, modify }) {
  const [idSeller, setSeller] = useState('');
  if (sellerId) {
    setSeller(sellerId);
  }
  // let idSeller = sellerId;
  let idProduct = productId;
  // if parameters are not passed, retrieve from session
  useEffect(() => {
    const getUserWrapper = async () => {
      const resp = await getUserIdFromToken(sessionStorage.getItem('app-token'));
      if (!idSeller && resp) {
        setSeller(resp.data);
      }
    };
    getUserWrapper();
  }, [idSeller]);

  const { productIdInParam } = useParams();
  if (!idProduct && modify) {
    idProduct = productIdInParam;
  }

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState(0.00);
  const [newCondition, setNewCondition] = useState('');
  const [newPictures, setNewPictures] = useState([]);
  // https://www.w3schools.com/react/react_useref.asp (useRef)
  const url = useRef([]);
  const [newCategory, setNewCategory] = useState('');
  const navigate = useNavigate();
  const changedPicture = useRef(false);

  // if idProduct is passed, retrieve old product data from api
  useEffect(() => {
    const getProductInfo = async () => {
      const response = await getProduct(idProduct);
      // assign old product data to form variables
      setNewName(response.productName);
      setNewPictures(response.productImage);
      setNewDescription(response.productDescription);
      setNewPrice(response.productPrice);
      setNewCondition(response.productCondition);
      setNewCategory(response.productCategory);
    };
    if (idProduct) {
      getProductInfo();
    }
  }, [idProduct]);

  const getUrls = async () => {
    // make a call to S3
    if ((newPictures.length > 0 && !modify) || (modify && changedPicture.current)) {
      const formData = new FormData();
      let i;
      for (i = 0; i < newPictures.length; i += 1) {
        formData.append(`File_${i}`, newPictures[i]);
      }
      const urls = await uploadFile(newPictures);

      if (urls !== '') {
        url.current = urls.data;
      }
    } else if (modify && !changedPicture.current) {
      url.current = newPictures;
    }
  };

  const handleOnChange = async (e) => {
    if (e.target.id === 'nameInput') {
      setNewName(e.target.value);
    } else if (e.target.id === 'descriptionInput') {
      setNewDescription(e.target.value);
    } else if (e.target.id === 'picturesInput') {
      // const files = Array.from(e.target.files);
      const files = Array.from(e.target.files);
      // setNewPictures(newPictures.concat(files));
      changedPicture.current = true;
      setNewPictures(files);
    } else if (e.target.id === 'priceInput') {
      if (e.target.value < 0) {
        e.target.value = '';
      } else {
        setNewPrice(e.target.value);
      }
    } else if (e.target.id === 'conditionInput') {
      setNewCondition(e.target.value);
    } else if (e.target.id === 'categoryInput') {
      setNewCategory(e.target.value);
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const time = new Date();
    await getUrls();
    changedPicture.current = false;
    const newProduct = {
      productName: newName,
      productImage: url.current,
      productDescription: newDescription,
      productCategory: newCategory,
      productPrice: parseFloat(newPrice),
      productPostedDate: time.toISOString(),
      productCondition: newCondition,
      productSeller: parseInt(idSeller, 10),
    };
    // POST if idProduct is not passed, PUT if idProduct is passed
    if (modify) {
      await updateProduct(idProduct, newProduct);
    } else {
      await makeProduct(newProduct);
    }
    document.getElementById('add-form').reset();
    navigate('/user');
  };

  // if cannot get user, return empty page
  if (!idSeller) {
    return null;
  }
  return (
    <div>
      <form onSubmit={handleOnSubmit} data-testid="add-form" id="add-form">
        <h1>{modify ? 'Modify Product' : 'Upload Product'}</h1>
        <div className="upload-product-form-group">
          <label htmlFor="picturesInput" className="upload-product-label">
            Pictures:
            { modify ? (
              <input
                id="picturesInput"
                data-testid="picturesInput"
                type="file"
                multiple
                onChange={handleOnChange}
                className="upload-product-picture"
                placeholder="Upload pictures"
              />
            ) : (
              <input
                id="picturesInput"
                data-testid="picturesInput"
                type="file"
                multiple
                onChange={handleOnChange}
                className="upload-product-picture"
                placeholder="Upload pictures"
                required
              />
            )}
          </label>
        </div>
        <div className="upload-product-form-group">
          <label htmlFor="nameInput" className="upload-product-label">
            <input
              id="nameInput"
              data-testid="nameInput"
              type="text"
              value={newName}
              onChange={handleOnChange}
              required
              className="upload-product-form-control"
              placeholder="Enter the product name"
            />
          </label>
        </div>
        <div className="upload-product-form-group">
          <label htmlFor="descriptionInput" className="upload-product-label">
            <textarea
              id="descriptionInput"
              data-testid="descriptionInput"
              value={newDescription}
              onChange={handleOnChange}
              required
              className="upload-product-form-control"
              placeholder="Enter the product description"
            />
          </label>
        </div>
        <div className="upload-product-form-group">
          <label htmlFor="priceInput" className="upload-product-label">
            <input
              id="priceInput"
              data-testid="priceInput"
              type="number"
              step="0.01"
              value={newPrice}
              onChange={handleOnChange}
              required
              className="upload-product-form-control"
              placeholder="Price..."
            />
          </label>
        </div>
        <div className="upload-product-form-group">
          <label htmlFor="conditionInput" className="upload-product-label">
            <select
              id="conditionInput"
              data-testid="conditionInput"
              value={newCondition}
              onChange={handleOnChange}
              required
              className="upload-product-form-control"
            >
              <option value="">Select the condition...</option>
              <option value="New">New</option>
              <option value="Slighty used">Slightly used</option>
              <option value="Used">Used</option>
            </select>
          </label>
        </div>
        <div className="upload-product-form-group">
          <label htmlFor="categoryInput" className="upload-product-label">
            <select
              id="categoryInput"
              data-testid="categoryInput"
              value={newCategory}
              onChange={handleOnChange}
              required
              className="upload-product-form-control"
            >
              <option value="">Select the category...</option>
              <option value="Bathroom">Bathroom</option>
              <option value="Bedroom">Bedroom</option>
              <option value="Kithcen">Kitchen</option>
              <option value="Electronics">Electronics</option>
              <option value="School Supplies">School Supplies</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>
        <div className="upload-product-form-group upload-product-button-group">
          <Link to="/home">
            <button type="button" className="upload-product-btn upload-product-btn-danger">
              Back
            </button>
          </Link>
          <button type="submit" className="upload-product-btn upload-product-btn-primary" data-testid="submitBtn">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}

ProductForm.propTypes = {
  sellerId: PropTypes.number,
  productId: PropTypes.number,
  modify: PropTypes.bool,
};

ProductForm.defaultProps = {
  sellerId: null,
  productId: null,
  modify: false,
};

export default ProductForm;
