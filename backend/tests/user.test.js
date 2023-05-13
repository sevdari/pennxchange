const request = require('supertest');
const { ObjectId } = require('mongodb');
const webapp = require('../server');
const { getDB, close } = require('../model/mainDB');

let db;
let testUserId;

// test data
const testUserData = {
  username: 'testuser',
  password: 'testuserpassword',
  pennId: 43218765,
  email: 'testuser@gmail.com',
  picture: 'https://someimage.com/testimage',
  wishlist: [1, 2],
};

describe('Get and update user', () => {
  beforeAll(async () => {
    db = await getDB();
    // insert a user into the database
    try {
      const users = db.collection('Users');
      const result = await users.insertOne(testUserData);
      testUserId = result.insertedId;
    } catch (err) {
      testUserId = -1;
    }
  });

  afterAll(async () => {
    try {
      const result = await db.collection('Users').deleteOne({ _id: testUserId });
      const { deletedCount } = result;
      if (deletedCount !== 1) {
        console.log('Error when deleting test user, deletedCount is not 1');
      }
    } catch (err) {
      console.log('Error when deleting test user', err.message);
    }
    await close();
  });

  test('get user by existing id', async () => {
    const response = await request(webapp).get('/user/43218765');
    expect(response.status).toBe(200);
    // expect(response.body.data).toEqual(testUserData);
    const userData = response.body.data;
    expect(userData).toMatchObject({ ...testUserData, _id: testUserId.toString() });
  });

  test('get user by non-existing id', async () => {
    const response = await request(webapp).get('/user/11223366');
    expect(response.status).toBe(404);
  });

  test('update user password', async () => {
    const response = await request(webapp).put(`/forgot_password/${testUserId.toString()}`)
      .send('password=newpassword');
    expect(response.status).toBe(200);
  });

  test('update user password without providing new password', async () => {
    const response = await request(webapp).put('/forgot_password/11223366')
      .send('anything=empty');
    expect(response.status).toBe(404);
  });
});

describe('sign up user', () => {
  beforeAll(async () => {
    db = await getDB();
    // don't insert user cuz we are testing POST
  });

  afterAll(async () => {
    try {
      const result = await db.collection('Users').deleteOne({ _id: new ObjectId(testUserId) });
      const { deletedCount } = result;
      if (deletedCount !== 1) {
        console.log('Error when deleting test user, deletedCount is not 1');
      }
    } catch (err) {
      console.log('Error when deleting test user', err.message);
    }
    await close();
  });

  test('sign up user', async () => {
    const response = await request(webapp).post('/user')
      .send('username=testuser&password=testpwd&pennId=43218765&email=test@gmail.com');
    expect(response.status).toBe(201);
    const userData = response.body.data;
    testUserId = userData.id;
  });

  test('sign up user with info missing', async () => {
    const response = await request(webapp).post('/user')
      .send('username=testuser&password=testpwd&pennId=43218765');
    expect(response.status).toBe(400);
  });
});
