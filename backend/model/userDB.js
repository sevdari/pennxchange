const { Int32, ObjectId } = require('mongodb');
const mainDB = require('./mainDB');
const profileDefaultImage = require('../utils/string');

/**
 * Gets all users in the database
 */
const getAllUsers = async () => {
  try {
    const db = await mainDB.getDB();
    const allUsers = await db.collection('Users').find({}).toArray();
    return allUsers;
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * Returns the user object that matches the pennId
 */
const getUserId = async (pennId) => {
  try {
    const db = await mainDB.getDB();
    const user = await db.collection('Users').findOne(
      { pennId: parseInt(pennId, 10) },
    );
    return user;
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * Creates a new user, returns the id of the new user
 */
const createUser = async (newUser) => {
  // no need to validate the input, verified in the controller
  try {
    const db = await mainDB.getDB();
    // picture and wishlist is default, cannot be modified during signup
    const user = await db.collection('Users').insertOne({
      ...newUser,
      pennId: new Int32(newUser.pennId),
      picture: profileDefaultImage,
      wishlist: [],
    });
    return user.insertedId;
  } catch (err) {
    console.log('Error when createUser: ', err);
    return null;
  }
};

/**
 * Update the password of the user, given the ObjectId of user
 */
const updatePassword = async (userId, newPassword) => {
  // get the DBd
  const db = await mainDB.getDB();
  try {
    // update the student
    const result = await db.collection('Users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: { password: newPassword } },
    );
    return result;
  } catch (err) {
    console.log('Error when updateUser', err.message);
    return null;
  }
};

const changeUser = async (userId, newUser) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Users').updateOne(
      { pennId: parseInt(userId, 10) },
      {
        $set: {
          username: newUser.username,
          password: newUser.password,
          picture: newUser.picture,
        },
      },
    );
    return result;
  } catch (err) {
    return null;
  }
};

const getUserByUsername = async (username) => {
  try {
    const db = await mainDB.getDB();
    const user = await db.collection('Users').findOne({
      username,
    });
    return user;
  } catch (err) {
    return null;
  }
};

module.exports = {
  getAllUsers, getUserId, createUser, updatePassword, changeUser, getUserByUsername,
};
