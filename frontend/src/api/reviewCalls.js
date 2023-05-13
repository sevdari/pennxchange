import axios from 'axios';
import { rootURL } from '../utils/utils';

/**
 * retrieve and return a review - GET
 */

export const getReview = async (reviewId) => {
  try {
    const response = await axios.get(`${rootURL}/review/${reviewId}`);
    return response.data.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * retrieve and return all views of a seller - GET
 */

export const getReviewSeller = async (sellerId) => {
  try {
    // console.log(sellerId);
    const response = await axios.get(`${rootURL}/sellerReview/${sellerId}`);
    // const sellerReviews = response.data.filter(
    //   (review) => review.sellerId === sellerId,
    // );
    // console.log('seller reviews:', sellerReviews);
    return response.data.data;
  } catch (err) {
    // console.error('error', err.message);
    return err;
  }
};

/**
 * add review - POST
 */

export const addReview = async (addReviewObject) => {
  try {
    const response = await axios.post(`${rootURL}/review`, `buyerId=${addReviewObject.buyerId}&sellerId=${addReviewObject.sellerId}&rating=${addReviewObject.rating}&content=${addReviewObject.content}&time=${addReviewObject.time}`);
    // console.log('addReview response:', response.data);
    return response.data.data;
  } catch (err) {
    // console.error('error', err.message);
    return err.message;
  }
};

/**
 * modify review - PUT
 */

export const modifyReview = async (reviewId, modifyReviewObject) => {
  try {
    const response = await axios.put(`${rootURL}/review/${reviewId}`, `rating=${modifyReviewObject.rating}&content=${modifyReviewObject.content}&time=${modifyReviewObject.time}`);
    // console.log('addReview response:', response.data);
    return response.data.data;
  } catch (err) {
    // console.error('error', err.message);
    return err.message;
  }
};

/**
 * delete review - DELETE
 * Resources:
 * https://jasonwatmore.com/post/2021/08/25/axios-http-delete-request-examples
 * https://stackblitz.com/edit/axios-http-delete-request-examples?file=delete-request-async-await.js
 */

export const deleteReview = async (reviewId) => {
  try {
    const response = await axios.delete(`${rootURL}/review/${reviewId}`);
    // console.log('deleteReview response:', response.data);
    return response.data.data;
  } catch (err) {
    // console.error('error', err.message);
    return err.message;
  }
};
