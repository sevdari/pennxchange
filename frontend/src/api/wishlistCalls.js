import axios from 'axios';
import { rootURL } from '../utils/utils';

/**
 * retrieve and return a user's wishlist (array of ) - GET
 */

export const getWishlist = async (pennId) => {
  try {
    const response = await axios.get(`${rootURL}/wishlist/${pennId}`);
    return response.data.data;
  } catch (err) {
    // console.error('error', err.message);
    return err;
  }
};

/**
 * add a given product to a given user's wishlist - PUT
 */

export const addWishlist = async (pennId, productId) => {
  try {
    const response2 = await axios.put(`${rootURL}/wishlist/${pennId}/${productId}`);
    return response2.status;
  } catch (err) {
    // console.error('error', err.message);
    return err;
  }
};

/**
 * delete product from wishlist - DELETE
 * https://masteringjs.io/tutorials/axios/put
 * https://pimylifeup.com/javascript-for-loop/
 */

export const deleteFromWishlist = async (pennId, productId) => {
  try {
    const response2 = await axios.delete(`${rootURL}/wishlist/${pennId}/${productId}`);
    return response2.status;
  } catch (err) {
    // console.error('error', err.message);
    return err;
  }
};
