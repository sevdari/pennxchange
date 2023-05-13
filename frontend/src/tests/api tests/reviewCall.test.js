import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import {
  getReview, addReview, modifyReview, deleteReview, getReviewSeller,
} from '../../api/reviewCalls';

const mockAxios = new MockAdapter(axios);

describe('the getReview api returns the correct data for review', () => {
  mockAxios.onGet().reply(200, {
    data: [
      {
        id: 1,
        buyerId: 2,
        sellerId: 1,
        rating: 5,
        content: 'Great product',
        time: '2023-03-16T03:00:00Z',
      },
      {
        id: 2,
        buyerId: 2,
        sellerId: 3,
        rating: 5,
        content: 'You are the best seller',
        time: '2023-03-18T03:00:00Z',
      },
    ],
  });

  test('the content is "Great product"', async () => {
    const data = await getReview(1);
    expect(data[0].content).toBe('Great product');
  });
});

describe('get addReview api add new messages', () => {
  const postData = {
    id: 2,
    buyerId: 2,
    sellerId: 3,
    rating: 5,
    content: 'You are the best seller',
    time: '2023-03-18T03:00:00Z',
  };
  mockAxios.onPost().reply(201, {
    data: postData,
  });

  test('message is addedd successfully', async () => {
    const response = await addReview(postData);
    expect(response.content).toBe('You are the best seller');
  });
});

describe('get modifyReview api modify messages', () => {
  const updateObj = {
    buyerId: 2,
    sellerId: 3,
    rating: 5,
    content: 'You are the best seller',
    time: '2023-03-18T03:00:00Z',
  };
  mockAxios.onPut().reply(200, {
    data: updateObj,
  });

  test('message is modified successfully', async () => {
    const response = await modifyReview(2, updateObj);
    expect(response.content).toBe('You are the best seller');
  });
});

describe('get deleteReview api delete messages', () => {
  mockAxios.onDelete().reply(200, { data: [] });

  test('message is deleted successfully', async () => {
    const response = await deleteReview(2);
    expect(response).toStrictEqual([]);
  });
});

describe('get getReviewSeller api returns al reviews for a seller', () => {
  mockAxios.onGet().reply(200, {
    data: [
      {
        id: 1,
        buyerId: 2,
        sellerId: 1,
        rating: 5,
        content: 'Great product',
        time: '2023-03-16T03:00:00Z',
      },
      {
        id: 2,
        buyerId: 2,
        sellerId: 3,
        rating: 5,
        content: 'You are the best seller',
        time: '2023-03-18T03:00:00Z',
      },
    ],
  });

  test('the content is "Great product"', async () => {
    const data = await getReviewSeller(1);
    expect(data.length).toBe(2);
    expect(data[0].content).toBe('Great product');
    expect(data[1].content).toBe('You are the best seller');
  });
});
