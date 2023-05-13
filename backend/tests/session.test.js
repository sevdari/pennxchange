const request = require('supertest');
const webapp = require('../server');
const { getDB, close } = require('../model/mainDB');

let db;
let testUserId;
let apptoken;

// test data
const testUserData = {
  username: 'testuser',
  password: 'testuserpassword',
  pennId: 43218766,
  email: 'testuser@gmail.com',
  picture: 'https://someimage.com/testimage',
  wishlist: [1, 2],
};

describe('Test token', () => {
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

  test('after login, token generated', async () => {
    const response = await request(webapp).post('/login')
      .send('pennId=43218766&password=testuserpassword');
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('apptoken');
    apptoken = response.body.apptoken;
  });

  test('wrong auth provided, token is null', async () => {
    const response = await request(webapp).post('/login')
      .send('pennId=43218766&password=wrongpassword');
    expect(response.status).toBe(401);
    expect(response.body).not.toHaveProperty('apptoken');
  });

  test('auth info missing, token is null', async () => {
    const response = await request(webapp).post('/login')
      .send('pennId=43218766');
    expect(response.status).toBe(400);
    expect(response.body).not.toHaveProperty('apptoken');
  });

  test('decode from valid token', async () => {
    const response = await request(webapp).get(`/decode/${apptoken}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });

  test('decode from invalid token', async () => {
    const response = await request(webapp).get('/decode/invalidtoken');
    expect(response.status).toBe(404);
  });
});
