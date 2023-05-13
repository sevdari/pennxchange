import axios from 'axios';

import { rootURL } from '../utils/utils';

// get a user from the backend
export const getUser = async (userId) => {
  // always use try/catch with async/await
  try {
    const response = await axios.get(`${rootURL}/user/${userId}`);
    // console.log(response.data);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const changeUser = async (userId, newUser) => {
  try {
    const response = await axios.put(`${rootURL}/user/${userId}`, newUser);
    return response;
  } catch (err) {
    return err;
  }
};

export const dummy = '';
