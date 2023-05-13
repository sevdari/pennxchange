import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  searchProduct,
  getProduct,
  makeProduct,
  getSimilarProducts,
  deleteProduct,
  getPostedProducts,
  updateProduct,
} from '../../api/productCalls';
import { rootURL } from '../../utils/utils';

const mockAxios = new MockAdapter(axios);

describe('test product api calls', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('test getProduct', async () => {
    mockAxios.onGet(`${rootURL}/product/1`).reply(200, {
      data: [
        {
          id: 1,
          productImage: [
            'https://images.unsplash.com/photo-1581652973557-5d04ba3cc54c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
          ],
          productName: 'Fork Set',
          productPrice: 14.99,
          productDescription: 'Set of forks',
          productCategory: 'Kitchen',
          productPriceCategory: 'Bid',
          productPostedDate: '2023-03-17T07:00:00Z',
          productCondition: 'New',
          productSeller: 12312312,
        },
      ],
    });
    const response = await getProduct(1);
    expect(response[0].productName).toEqual('Fork Set');
  });

  test('test searchProduct', async () => {
    mockAxios.onGet(`${rootURL}/search/Shelf`).reply(200, [1]);
    const response = await searchProduct('Shelf');
    expect(response[0]).toBe(1);
  });

  test('test makeProduct', async () => {
    const makeProductObj = {
      id: 2,
      productImage: [
        'https://images.unsplash.com/photo-1581652973557-5d04ba3cc54c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      ],
      productName: 'Silverware',
      productPrice: 10.99,
      productDescription: '10 forks and 10 spoons',
      productCategory: 'Kitchen',
      productPriceCategory: 'Bid',
      productPostedDate: '2023-04-20T05:30:00Z',
      productCondition: 'Slightly Used',
      productSeller: 23423423,
    };

    mockAxios.onPost(`${rootURL}/product`).reply(201, {
      data: makeProductObj,
    });

    const response = await makeProduct(makeProductObj);
    expect(response).toStrictEqual(makeProductObj);
  });

  test('test getSimilarProducts', async () => {
    mockAxios.onGet().reply(200, {
      data: [2, 3],
    });

    const expected = [2, 3];
    const response = await getSimilarProducts(1);
    expect(expected).toStrictEqual(response);
  });

  test('test deleteProduct', async () => {
    const productId = 1;

    mockAxios.onGet(`${rootURL}/allUsers`).reply(200, { data: [] });
    mockAxios.onDelete(`${rootURL}/product/${productId}`).reply(200, 200);

    // it also deletes the product from wishlist, which needs to call /user api
    // so we need to mock that too
    mockAxios.onGet(`${rootURL}/user`).reply(200, { data: [] }); // empty list should be enough

    const response = await deleteProduct(productId);
    expect(response).toBe(200);
  });

  test('test getPostedProducts', async () => {
    mockAxios.onGet(`${rootURL}/product`).reply(200, {
      data: [{
        _id: 'mongodbStringId1',
        productImage: [
          'https://images.unsplash.com/photo-1581652973557-5d04ba3cc54c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        ],
        productName: 'Silverware',
        productPrice: 10.99,
        productDescription: '10 forks and 10 spoons',
        productCategory: 'Kitchen',
        productPriceCategory: 'Bid',
        productPostedDate: '2023-04-20T05:30:00Z',
        productCondition: 'Slightly Used',
        productSeller: 23423423,
      },
      {
        _id: 'mongodbStringId2',
        productImage: [
          'https://images.unsplash.com/photo-1581652973557-5d04ba3cc54c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        ],
        productName: 'Cup',
        productPrice: 3.99,
        productDescription: 'Cup for drinking',
        productCategory: 'Kitchen',
        productPriceCategory: 'Bid',
        productPostedDate: '2023-04-20T05:30:00Z',
        productCondition: 'New',
        productSeller: 45645645,
      }],
    });

    const expected = ['mongodbStringId1'];
    const response = await getPostedProducts(23423423);
    expect(expected).toStrictEqual(response);
  });

  test('test updateProducts', async () => {
    const productId = 1;
    const newProduct = {
      id: 1,
      productImage: [
        'does not matter',
      ],
      productName: 'Silverware modified',
      productPrice: 10.99,
      productDescription: '10 forks and 10 spoons',
      productCategory: 'Kitchen',
      productPriceCategory: 'Bid',
      productPostedDate: '2023-04-20T05:30:00Z',
      productCondition: 'Slightly Used',
      productSeller: 23423423,
    };

    mockAxios.onPut(`${rootURL}/product/${productId}`).reply(200, { data: newProduct });

    const response = await updateProduct(productId, newProduct);
    expect(response).toStrictEqual(newProduct);
  });
});

describe('test exceptions', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('test getProduct exception', async () => {
    const productId = 2;

    mockAxios.onGet(`${rootURL}/product/${productId}`).reply(200, {
      id: 2,
      productImage: [
        'https://images.unsplash.com/photo-1581652973557-5d04ba3cc54c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      ],
      productName: 'Silverware',
      productPrice: 10.99,
      productDescription: '10 forks and 10 spoons',
      productCategory: 'Kitchen',
      productPriceCategory: 'Bid',
      productPostedDate: '2023-04-20T05:30:00Z',
      productCondition: 'Slightly Used',
      productSeller: 23423423,
    });

    const errorMessage = await getProduct(1);
    expect(errorMessage).toStrictEqual('Request failed with status code 404');
  });

  test('test deleteProduct exception', async () => {
    const productId = 1;

    mockAxios.onDelete(`${rootURL}/product/${productId}`).reply(200, 200);

    const response = await deleteProduct(2);

    expect(response).toStrictEqual('Request failed with status code 404');
  });
});
