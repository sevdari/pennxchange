const { ObjectId } = require('mongodb');
const request = require('supertest');
const { close, connect } = require('../model/mainDB');
const webapp = require('../server');

const insertTestDataToDB = async (database, testData) => {
  const result = await database.collection('Messages').insertOne(testData);
  return result.insertedId;
};

const deleteTestDataFromDB = async (database, testData) => {
  try {
    // const result =
    await database.collection('Messages').deleteOne({ _id: new ObjectId(testData) });
    // const { deletedCount } = result;
    // if (deletedCount === 1) {
    //   console.log('info', 'Successfully deleted test message');
    // } else {
    //   console.log('warning', 'test message was not deleted');
    // }
  } catch (err) {
    console.log('error', err.message);
  }
};

const testMessage = {
  sender: 7,
  receiver: 8,
  time: '2023-04-25T02:00:00Z',
  content: 'Test!',
};

const isInArray = (arr, val) => {
  let value = false;
  arr.map((x) => {
    const { _id } = x;
    if (String(_id) === String(val)) {
      value = true;
    }
    return null;
  });
  return value;
};

let mongo;

// test GET
describe('GET message(s) endpoint integration test', () => {
  let db;
  let testMessageID;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    testMessageID = await insertTestDataToDB(db, testMessage);
  });

  afterAll(async () => {
    await deleteTestDataFromDB(db, testMessageID);
    try {
      await close();
    } catch (err) {
      return err;
    }
    return null;
  });

  test('Get all messages', async () => {
    const resp = await request(webapp).get('/message');
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    const messageArr = JSON.parse(resp.text).data;
    expect(isInArray(messageArr, testMessageID)).toBe(true);
  });

  test('Get a message with ID', async () => {
    const resp = await request(webapp).get(`/message/${testMessage.sender}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    // const messageArr = JSON.parse(resp.text).data;
    // console.log('MESSAGE ARRAY: ', messageArr);
    // expect(isInArray(messageArr, testMessageID)).toBe(true);
  });

  test('Get a message with invalid ID', async () => {
    const resp = await request(webapp).get('/message/500');
    expect(resp.status).toBe(404);
    expect(resp.type).toBe('application/json');
  });

  test('Get contacts for valid ID', async () => {
    const resp = await request(webapp).get('/contacts/7');
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    expect(JSON.parse(resp.text).data).toStrictEqual([8]);
  });

  test('Get contacts for invalid ID', async () => {
    const resp = await request(webapp).get('/contacts/10');
    // do we want it to return an error or empty list
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    expect(JSON.parse(resp.text).data).toStrictEqual([]);
  });

  test('Get contacts without an ID', async () => {
    const resp = await request(webapp).get('/contacts');
    expect(resp.status).toBe(404);
    // expect(resp.type).toBe('application/json');
    // expect(JSON.parse(resp.text).data).toStrictEqual([]);
  });

  test('Get chat history wth valid ID', async () => {
    const resp = await request(webapp).get('/messages/7/8');
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    expect(JSON.parse(resp.text).data.length).toBe(1);
  });

  test('Get chat history wth invalid ID', async () => {
    const resp = await request(webapp).get('/messages/7/9');
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    expect(JSON.parse(resp.text).data.length).toBe(0);
  });
});

// test POST
describe('POST message(s) endpoint integration test', () => {
  let db;
  let testMessageID;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    // testMessageID = await insertTestDataToDB(db, testMessage);
    // console.log('testMessageID', testMessageID);
  });

  afterAll(async () => {
    await deleteTestDataFromDB(db, testMessageID);
    try {
      await close();
    } catch (err) {
      return err;
    }
    return null;
  });

  test('Post a message', async () => {
    const resp = await request(webapp).post('/message')
      .send(`sender=${testMessage.sender}&receiver=${testMessage.receiver}&time=${testMessage.time}&content=${testMessage.content}`);
    expect(resp.status).toBe(200);
    expect(resp.type).toBe('application/json');
    testMessageID = String(JSON.parse(resp.text).data.id);
    // check that it's actually there
    const resp1 = await request(webapp).get(`/message/${testMessage.sender}`);
    expect(resp1.status).toBe(200);

    const resp2 = await request(webapp).get(`/message/${testMessage.receiver}`);
    expect(resp2.status).toBe(200);
  });

  test('Post a message with missing information', async () => {
    const resp = await request(webapp).post('/message')
      .send(`receiver=${testMessage.receiver}&time=${testMessage.time}&content=${testMessage.content}`);
    expect(resp.status).toBe(404);
  });
});
