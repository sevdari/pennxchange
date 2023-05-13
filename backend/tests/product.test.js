const request = require('supertest');
const { ObjectId } = require('mongodb');
const webapp = require('../server');
const { close, connect } = require('../model/mainDB');

let mongo;
let db;
let testProductID;

/**
 * Utility functions for testing
 */

const insertTestDataToDB = async (database, testData) => {
  const result = await database.collection('Products').insertOne(testData);
  return result.insertedId;
};

const deleteTestDataFromDb = async (database, testProductId) => {
  try {
    const result = await database.collection('Products').deleteOne({ _id: new ObjectId(testProductId) });
    const { deletedCount } = result;
    if (deletedCount !== 1) {
      console.log('warning', 'test product was not deleted');
    }
  } catch (err) {
    console.log('error', err.message);
  }
};

// test product
const testProduct = {
  productImage: ['http://test.com/test'],
  productName: 'Test Product',
  productPrice: 9.99,
  productDescription: 'This is a test product',
  productCategory: 'Electronics',
  productPriceCategory: 'Bid',
  productPostedDate: '2023-04-20T06:30:00Z',
  productCondition: 'Slightly Used',
  productSeller: 34534534,
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

// test GET
describe('GET products endpoint integration test', () => {
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    // add test product to mongodb
    testProductID = await insertTestDataToDB(db, testProduct);
  });

  afterAll(async () => {
    await deleteTestDataFromDb(db, testProductID);
    try {
      await close();
    } catch (err) {
      return err;
    }
    return null;
  });

  test('Get all products', async () => {
    const resp = await request(webapp).get('/product');
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const prodArr = JSON.parse(resp.text).data;
    expect(isInArray(prodArr, testProductID)).toBe(true);
  });

  test('Get a product from a valid id', async () => {
    const resp = await request(webapp).get(`/product/${testProductID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const prodArr = JSON.parse(resp.text).data;
    expect(prodArr.productName).toEqual('Test Product');
  });

  test('Get a product from an invalid id', async () => {
    const resp = await request(webapp).get(`/product/${1}`);
    expect(resp.status).toEqual(404);
    expect(resp.type).toBe('application/json');
    // console.log(resp);
  });
});

// test POST
describe('POST products endpoint integration test', () => {
  let response;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    // testProductID = await insertTestDataToDB(db, testProduct);
  });

  afterAll(async () => {
    await deleteTestDataFromDb(db, testProductID);
    try {
      await mongo.close();
      await close();
    } catch (err) {
      return err;
    }
    return null;
  });

  test('Status code and type check', async () => {
    // post product
    response = await request(webapp).post('/product')
      .send(`productImage=${testProduct.productImage}&productName=${testProduct.productName}&productPrice=${testProduct.productPrice}&productDescription=${testProduct.productDescription}&productCategory=${testProduct.productCategory}&productPriceCategory=${testProduct.productPriceCategory}&productPostedDate=${testProduct.productPostedDate}&productCondition=${testProduct.productCondition}&productSeller=${testProduct.productSeller}`);
    expect(response.status).toBe(201);
    expect(response.type).toBe('application/json');
    testProductID = String(response.body.data.id);
  });

  // copy-pasted same test as GET productID
  test('Product is in the DB', async () => {
    const resp = await request(webapp).get(`/product/${testProductID}`);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe('application/json');
    const prodArr = JSON.parse(resp.text).data;
    expect(prodArr.productName).toEqual('Test Product');
  });

  test('Missing a field', async () => {
    response = await request(webapp).post('/product')
      .send(`productName=${testProduct.productName}&productPrice=${testProduct.productPrice}&productDescription=${testProduct.productDescription}&productCategory=${testProduct.productCategory}&productPriceCategory=${testProduct.productPriceCategory}&productPostedDate=${testProduct.productPostedDate}&productCondition=${testProduct.productCondition}&productSeller=${testProduct.productSeller}`);
    expect(response.status).toBe(404);
    expect(response.type).toBe('application/json');
  });
});

// test PUT
describe('PUT products endpoint integration test', () => {
  let response;

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    // add test product to mongodb
    testProductID = await insertTestDataToDB(db, testProduct);
  });

  afterAll(async () => {
    await deleteTestDataFromDb(db, testProductID);
    try {
      await mongo.close();
      await close();
    } catch (err) {
      return err;
    }
    return null;
  });

  test('Status code and type check', async () => {
    // post product
    response = await request(webapp).put(`/product/${testProductID}`)
      .send(`productImage=${testProduct.productImage}&productName=New&productPrice=${testProduct.productPrice}&productDescription=${testProduct.productDescription}&productCategory=${testProduct.productCategory}&productPriceCategory=${testProduct.productPriceCategory}&productPostedDate=${testProduct.productPostedDate}&productCondition=${testProduct.productCondition}&productSeller=${testProduct.productSeller}`);
    expect(response.status).toBe(200);
    expect(response.type).toBe('application/json');
  });

  // copy-pasted same test as GET productID
  test('Product is in the DB with new name', async () => {
    const resp = await request(webapp).get(`/product/${testProductID}`);
    const prodArr = JSON.parse(resp.text).data;
    expect(prodArr.productName).toEqual('New');
  });

  test('Missing a field', async () => {
    response = await request(webapp).put('/product')
      .send(`productName=${testProduct.productName}`);
    expect(response.status).toBe(404);
  });
});

// test DELETE
describe('DELETE products endpoint integration test', () => {
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();

    // add test product to mongodb
    testProductID = await insertTestDataToDB(db, testProduct);
  });

  afterAll(async () => {
    // await deleteTestDataFromDb(db, testProductID);
    try {
      await mongo.close();
      await close();
    } catch (err) {
      return err;
    }
    return null;
  });

  test('Deleting a product with incorrect ID', async () => {
    // check that the product is in the db
    const resp1 = await request(webapp).get(`/product/${testProductID}`);
    expect(resp1.status).toBe(200);

    // delete the product without a valid id
    const resp2 = await request(webapp).delete('/product/1');
    expect(resp2.status).toBe(404);

    // delete the product without a valid id
    const resp3 = await request(webapp).delete('/product');
    expect(resp3.status).toBe(404);
  });

  test('Deleting a product with valid ID', async () => {
    // check that the product is in the db
    const resp1 = await request(webapp).get(`/product/${testProductID}`);
    expect(resp1.status).toBe(200);

    // delete the product without a valid id
    const resp2 = await request(webapp).delete(`/product/${testProductID}`);
    expect(resp2.status).toBe(200);

    // check that it is deleted
    const resp3 = await request(webapp).get(`/product/${testProductID}`);
    expect(resp3.status).toBe(404);
  });

  // test('Missing a field', async () => {
  //   response = await request(webapp).put('/product')
  //     .send(`productName=${testProduct.productName}`);
  //   expect(response.status).toBe(404);
  // });
});
