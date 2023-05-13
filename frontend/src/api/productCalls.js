import axios from 'axios';
import { rootURL } from '../utils/utils';
import { deleteFromWishlist } from './wishlistCalls';

/**
 * retrieve products given a keyword/keywords in search - GET
 * https://sentry.io/answers/string-contains-substring-javascript/#:~:text=You%20can%20use%20JavaScript's%20includes,found%2C%20or%20false%20if%20not.
 */

export const searchProduct = async (keyword) => {
  try {
    const returnedProducts = await axios.get(`${rootURL}/search/${keyword}`);
    // return returnedProducts;
    return returnedProducts.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * retrieve and return a product given its id - GET
 */

export const getProduct = async (productId) => {
  try {
    const response = await axios.get(`${rootURL}/product/${productId}`);
    // return response.data;
    return response.data.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * get all products detailed - GET
 */

export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${rootURL}/product`);
    // return response.data;
    return response.data.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * get all posted products given seller id - GET
 */
export const getPostedProducts = async (sellerId) => {
  try {
    const allProducts = await axios.get(`${rootURL}/product`);
    const returnedProducts = [];
    // allProducts.data.forEach((product) => {
    //   if (product.productSeller === sellerId) {
    //     returnedProducts.push(product.id);
    //   }
    // });
    // https://www.mongodb.com/docs/manual/reference/method/ObjectId.toString/
    allProducts.data.data.forEach((product) => {
      const { _id } = product;
      if (product.productSeller === sellerId) {
        returnedProducts.push(_id.toString());
      }
    });
    return returnedProducts;
  } catch (err) {
    return err.message;
  }
};

/**
 * allows seller to upload a product - POST
 */

export const makeProduct = async (makeProductObject) => {
  try {
    const response = await axios.post(`${rootURL}/product`, makeProductObject);
    // return response.data;
    return response.data.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * allows seller to update a product - PUT
 */
export const updateProduct = async (productId, updateProductObject) => {
  try {
    const response = await axios.put(`${rootURL}/product/${productId}`, updateProductObject);
    // return response.data;
    return response.data.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * gets the similar products - GET
 */

export const getSimilarProducts = async (productId) => {
  try {
    const similarProducts = await axios.get(`${rootURL}/similar/${productId}`);
    return similarProducts.data.data;
  } catch (err) {
    return null;
  }
};

export const getLatestProducts = async () => {
  try {
    const latestProducts = await axios.get(`${rootURL}/latestProducts`);
    return latestProducts.data.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * deletes a products - DELETE
 */

export const deleteProduct = async (productId) => {
  try {
    // delete this product from all wishlists too
    const allUsers = await axios.get(`${rootURL}/allUsers`);
    // allUsers.data.forEach((element) => {
    //   deleteFromWishlist(element.pennId, productId);
    // });
    allUsers.data.data.forEach((element) => {
      deleteFromWishlist(element.pennId, productId);
    });
    const response = await axios.delete(`${rootURL}/product/${productId}`);
    return response.status;
  } catch (err) {
    // console.error('error', err.message);
    return err.message;
  }
};
