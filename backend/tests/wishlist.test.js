const request = require('supertest');
const { ObjectId } = require('mongodb');
const webapp = require('../server');

const { connect, close } = require('../model/mainDB');

const testUserData = {
  username: 'testuser',
  password: 'testuserpassword',
  pennId: 43218761,
  email: 'testuser@gmail.com',
  picture: 'https://someimage.com/testimage',
  wishlist: ['64266b3dce98dc8d3e79eda5'],
};

const insertTestDataToDB = async (db, testData, collection) => {
  try {
    const result = await db.collection(collection).insertOne(testData);
    return result.insertedId;
  } catch (err) {
    console.log('Error: ', err.message);
  }
  return null;
};

const deleteTestDataFromDB = async (db, testData, collection) => {
  try {
    await db.collection(collection).deleteOne({ _id: testData });
  } catch (err) {
    console.log('Error: ', err.message);
  }
};

let mongo;
let db;
let testUserId;

beforeAll(async () => {
  // connect to mongodb
  mongo = await connect();
  // reference to the actualy database (i.e., students)
  db = mongo.db();
  // add test data and store their id
  testUserId = await insertTestDataToDB(db, testUserData, 'Users');
});

afterAll(async () => {
  // delete test data from DB
  await deleteTestDataFromDB(db, testUserId, 'Users');
  // close the connection
  await mongo.close();
  await close();
});

test('getWishlist should return the user wishlist', async () => {
  const response = await request(webapp).get(`/wishlist/${testUserData.pennId}`);
  expect(response.status).toBe(200);
  expect(response.body.data).toEqual(['64266b3dce98dc8d3e79eda5']);
});

test('addWishlist should add an item to the user wishlist', async () => {
  const response = await request(webapp).put(`/wishlist/${testUserData.pennId}/6438b9743ad5c5f6121a9818`);
  expect(response.status).toBe(200);
  const updated = await db.collection('Users').findOne({ pennId: testUserData.pennId });
  expect(updated.wishlist).toEqual(['64266b3dce98dc8d3e79eda5', '6438b9743ad5c5f6121a9818']);
});

test('deleteWishlist should remove an item from the user wishlist', async () => {
  const response = await request(webapp).delete(`/wishlist/${testUserData.pennId}/64266b3dce98dc8d3e79eda5`);
  expect(response.status).toBe(200);
  const updated = await db.collection('Users').findOne({ pennId: testUserData.pennId });
  expect(updated.wishlist).toEqual(['6438b9743ad5c5f6121a9818']);
});
