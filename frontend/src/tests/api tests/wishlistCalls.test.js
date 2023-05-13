import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getWishlist, addWishlist, deleteFromWishlist } from '../../api/wishlistCalls';
import { rootURL } from '../../utils/utils';

const mockAxios = new MockAdapter(axios);

describe('the getWishlist api returns the correct data', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('When user has wishlist', async () => {
    mockAxios.onGet(`${rootURL}/wishlist/12312312`).reply(200, { data: [1, 2] });

    const data = await getWishlist(12312312);
    expect(data).toStrictEqual([1, 2]);
  });

  test('When user has nothing in wishlist', async () => {
    mockAxios.onGet(`${rootURL}/wishlist/12312312`).reply(200, { data: [] });

    const data = await getWishlist(12312312);
    expect(data).toStrictEqual([]);
  });
});

describe('the addWishlist api correctly adds data', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('When user doesn\'t have the product in wishlist before', async () => {
    mockAxios.onPut(`${rootURL}/wishlist/12312312/3`).reply(200);

    const data = await addWishlist(12312312, 3);
    expect(data).toBe(200);
  });

  test('When user has the product in wishlist before', async () => {
    mockAxios.onPut(`${rootURL}/wishlist/12312312/2`).reply(200);

    const data = await addWishlist(12312312, 2);
    expect(data).toBe(200);
  });
});

describe('the deleteWish api correctly delete data', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  test('When user doesn\'t have the product in wishlist before', async () => {
    mockAxios.onDelete(`${rootURL}/wishlist/12312312/3`).reply(200);

    const data = await deleteFromWishlist(12312312, 3);
    expect(data).toBe(200);
  });

  test('When user has the product in wishlist before', async () => {
    mockAxios.onDelete(`${rootURL}/wishlist/12312312/2`).reply(200);

    const data = await deleteFromWishlist(12312312, 2);
    expect(data).toBe(200);
  });
});
