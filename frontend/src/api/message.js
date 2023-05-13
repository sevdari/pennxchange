import axios from 'axios';
import { rootURL } from '../utils/utils';

// get all the students from the backend
export const getAllMessages = async () => {
// always use try/catch with async/await
  try {
    const response = await axios.get(`${rootURL}/message`);
    return response;
  } catch (error) {
    return error;
  }
};

export const addMessage = async (message) => {
  try {
    const response = await axios.post(`${rootURL}/message`, message);
    return response;
  } catch (error) {
    return error;
  }
};

// get contacts for user with id pennId
export const getContacts = async (pennId) => {
  try {
    const response = await axios.get(`${rootURL}/contacts/${pennId}`);
    return response;
  } catch (error) {
    return error;
  }
};

// get chat history between two users
export const getChatHistory = async (pennId1, pennId2) => {
  try {
    const response = await axios.get(`${rootURL}/messages/${pennId1}/${pennId2}`);
    return response;
  } catch (error) {
    return error;
  }
};
