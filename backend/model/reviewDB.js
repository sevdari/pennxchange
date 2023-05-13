const { ObjectId } = require('mongodb');
const mainDB = require('./mainDB');

/**
 * GET a review by its id
 * @param {*} id - id of the review
 * @returns - the review object
 */
const getReviewById = async (id) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Reviews').findOne({ _id: new ObjectId(id) });
    // console.log('Review: ', JSON.stringify(result));
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

/**
 * GET all reviews associated with this seller.
 * @param {*} id - id of the seller
 * @returns - all reviews
 */
const getReviewsBySellerId = async (id) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Reviews').find({ sellerId: parseInt(id, 10) }).toArray();
    // console.log(`Reviews: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    // console.log(`error: ${err.message}`);
    return null;
  }
};

/**
 * POST a new review
 * @param {*} newReview - the new review object
 * @returns the id of the inserted review
 */
const addReview = async (newReview) => {
  const db = await mainDB.getDB();
  const result = await db.collection('Reviews').insertOne(newReview);
  return result.insertedId;
};

const updateReview = async (reviewId, modifiedReview) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Reviews').updateOne(
      { _id: new ObjectId(reviewId) },
      {
        $set: {
          rating: modifiedReview.rating,
          content: modifiedReview.content,
          time: modifiedReview.time,
        },
      },
    );
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return null;
};

const deleteReview = async (id) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Reviews').deleteOne(
      { _id: new ObjectId(id) },
    );
    // console.log(`Reviews: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
  return null;
};

module.exports = {
  getReviewById,
  getReviewsBySellerId,
  addReview,
  updateReview,
  deleteReview,
};
