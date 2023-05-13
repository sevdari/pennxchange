/**
 * dummy file to check if the file is being uploaded
 */

import axios from 'axios';

const DEFAULT_URL = 'http://localhost:8080';

export const uploadFile = async (files) => {
  try {
    const res = await axios.post(`${DEFAULT_URL}/upload`, files, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    return err.message;
    // console.log(err.message);
  }
};

export const dummy = '';
