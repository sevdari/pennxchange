// eslint-disable-next-line no-unused-vars
const { ObjectId } = require('mongodb');
const mainDB = require('./mainDB');

const getWishlist = async (pennID) => {
  try {
    const db = await mainDB.getDB();
    const user = await db.collection('Users').findOne({ pennId: parseInt(pennID, 10) });
    return user.wishlist;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const addWishlist = async (pennID, item) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Users').updateOne({ pennId: parseInt(pennID, 10) }, { $push: { wishlist: item } });
    return result;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const deleteWishlist = async (pennID, item) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Users').updateOne({ pennId: parseInt(pennID, 10) }, { $pull: { wishlist: item } });
    return result;
  } catch (err) {
    console.log(err);
  }
  return null;
};

module.exports = {
  getWishlist,
  addWishlist,
  deleteWishlist,
};
