/* eslint-disable no-undef */
const request = require('supertest');
const { ObjectId } = require('mongodb');
const webapp = require('../server');

const { connect, close } = require('../model/mainDB');

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

const testReview = {
  buyerId: 12312312,
  sellerId: 12345678,
  rating: 6,
  content: 'The quality is not bad',
  time: '2023-04-07T03:00:00Z',
};

let mongo;
let db;
let testReviewId;
let testReviewId2;

beforeAll(async () => {
  // connect to mongodb
  mongo = await connect();
  // reference to the actualy database (i.e., students)
  db = mongo.db();
  // add test data and store their id
  testReviewId = await insertTestDataToDB(db, testReview, 'Reviews');
});

afterAll(async () => {
  // delete test data from DB
  await deleteTestDataFromDB(db, testReviewId, 'Reviews');
  // close the connection
  await mongo.close();
  await close();
});

test('get review by id', async () => {
  const res = await request(webapp).get(`/review/${testReviewId}`);
  expect(res.status).toEqual(200);
  const review = JSON.parse(res.text).data;
  expect(review).toMatchObject({ ...testReview, _id: testReviewId.toString() });
});

test('get review by non-existing id', async () => {
  const res = await request(webapp).get('/review/11111111');
  expect(res.status).toEqual(404);
});

test('get reviews by seller id', async () => {
  const res = await request(webapp).get('/sellerReview/12345678');
  expect(res.status).toEqual(200);
});

test('post a review', async () => {
  const res = await request(webapp).post('/review').send(`buyerId=${testReview.buyerId}&sellerId=${testReview.sellerId}&rating=${testReview.rating}&content=${testReview.content}&time=${testReview.time}`);
  testReviewId2 = JSON.parse(res.text).data.id;
  expect(res.status).toEqual(201);
});

test('update a review', async () => {
  const modifyReviewObject = {
    rating: 10,
    content: 'The quality is fantastic',
    time: '2023-04-08T03:00:00Z',
  };
  const res = await request(webapp).put(`/review/${testReviewId.toString()}`).send(`rating=${modifyReviewObject.rating}&content=${modifyReviewObject.content}&time=${modifyReviewObject.time}`);
  expect(res.status).toEqual(200);
  const updated = await db.collection('Reviews').findOne({ _id: new ObjectId(testReviewId) });
  expect(updated.rating).toEqual(10);
}, 10000);

test('delete a review', async () => {
  const res = await request(webapp).delete(`/review/${testReviewId2}`);
  expect(res.status).toEqual(200);
});
