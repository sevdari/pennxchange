const jwt = require('jsonwebtoken');

// import the env variables
require('dotenv').config();

const { getUserId } = require('../model/userDB');

/**
 * Check auth, and create a JWT token for the user
 * @param {string} pennId the pennId of the user
 * @param {string} password the password of the user
 * @returns {string} the token, null if there was an error such as invalid password
 */
const authenticateUser = async (pennId, password) => {
  try {
    const user = await getUserId(pennId);
    if (!user || user.password !== password) {
      return null;
    }
    const token = jwt.sign({ username: pennId }, process.env.KEY, { expiresIn: '2h' });
    return token;
  } catch (err) {
    return null;
  }
};

/**
 * Verify a token. Check if the user is valid
 * @param {*} token the token to verify
 * @returns true if the user is valid
 */
// const verifyUser = async (token) => {
//   try {
//     const decoded = jwt.verify(token, process.env.KEY);
//     const user = await getUserId(decoded.username);
//     if (!user) {
//       return false;
//     }
//     return true;
//   } catch (err) {
//     return false;
//   }
// };

/**
 * Get the pennId from the session token
 *
 * @param {string} token the token to decode
 * @returns {string} the pennId, null if the token is invalid
 */
const getPennIdFromToken = (token) => {
  try {
    const decoded = jwt.decode(token, process.env.KEY);
    return decoded.username;
  } catch (err) {
    return null;
  }
};

module.exports = { authenticateUser, getPennIdFromToken };
