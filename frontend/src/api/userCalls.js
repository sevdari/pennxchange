import axios from 'axios';
import { rootURL } from '../utils/utils';

/**
 * login a user and start session - POST
 */

export const loginUser = async (loginObject) => {
  try {
    const response = await axios.post(
      `${rootURL}/login`,
      `pennId=${loginObject.pennId}&password=${loginObject.password}`,
    );
    if (response.status === 201) {
      return response.data.apptoken;
    }
    // otherwise, auth failed
    return false;
  } catch (err) {
    return false;
  }
};

/**
 * allows user to recover password - PUT
 */

export const forgotPassword = async (forgotPasswordObject) => {
  try {
    const user = await axios.get(`${rootURL}/user/${forgotPasswordObject.pennId}`);
    if (!user) {
      // no such user exists
      return null;
    }
    const { _id } = user.data.data;
    const response = await axios.put(
      `${rootURL}/forgot_password/${_id}`,
      `password=${forgotPasswordObject.password}`,
    );
    return response;
  } catch (err) {
    return err.message;
  }
};

/**
 * sign up a new user - POST
 * Ask in OH
 */

export const signupUser = async (signupObject) => {
  try {
    const response = await axios.post(
      `${rootURL}/user`,
      `username=${signupObject.username}&password=${signupObject.password}&`
      + `pennId=${signupObject.pennId}&email=${signupObject.email}`,
    );
    return response.data.id;
  } catch (err) {
    return err.message;
  }
};

/**
 * Retrieve user info from user id - GET
 */
export const getUser = async (id) => {
  try {
    const response = await axios.get(`${rootURL}/user/${id}`);
    return response.data;
  } catch (err) {
    return err.message;
  }
};

/**
 * Decode the JWT token to get the user id
 * @param {*} token the app token retrieved from frontend
 * @returns the user id, or null if token is invalid
 */
export const getUserIdFromToken = async (token) => {
  if (!token) {
    return null;
  }
  try {
    const response = await axios.get(`${rootURL}/decode/${token}`);
    if (response.status === 200) {
      return response.data;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const getUserByUsername = async (username) => {
  try {
    const response = await axios.get(`${rootURL}/user/username/${username}`);
    // eslint-disable-next-line no-underscore-dangle
    return response.data.data;
  } catch (err) {
    return null;
  }
};
