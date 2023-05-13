// Description: Tests for the S3 API

// import the testing framework
const request = require('supertest');

const webapp = require('../server');

// eslint-disable-next-line no-undef
test('add an image', async () => {
  const response = await request(webapp).post('/upload')
    .attach('file', 'test3.jpeg')
    .set('Content-Type', 'multipart/form-data');
  // console.log('response:', response);
  // test status code
  // eslint-disable-next-line no-undef
  expect(response.status).toBe(201);
}, 30000);
