/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render, act, waitFor, cleanup, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

import WishlistPage from '../../components/WishlistPage';
import { getWishlist, deleteFromWishlist } from '../../api/wishlistCalls';
import { getProduct, getAllProducts } from '../../api/productCalls';

// mock api calls
jest.mock('../../api/wishlistCalls', () => ({
  getWishlist: jest.fn(),
  deleteFromWishlist: jest.fn(),
}));

jest.mock('../../api/productCalls', () => ({
  getProduct: jest.fn(),
  getAllProducts: jest.fn(),
}));

getAllProducts.mockImplementation(() => Promise.resolve(['1']));

getProduct.mockImplementation((id) => Promise.resolve({
  id: '1',
  productImage: ['does not matter'],
  productName: 'Silverware modified',
  productPrice: 10.99,
  productDescription: '10 forks and 10 spoons',
  productCategory: 'Kitchen',
  productPriceCategory: 'Bid',
  productPostedDate: '2023-04-20T05:30:00Z',
  productCondition: 'Slightly Used',
  productSeller: 23423423,
}));

// mock product simple, so that it doesn't make api calls
jest.mock('../../components/ProductCardSimple', () => {
  function ProductCardSimpleMock(props) {
    return <div>{props.productId}</div>;
  }
  return ProductCardSimpleMock;
});

describe('WishlistPage Snapshot', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('user has wishlist', async () => {
    getWishlist.mockImplementation((id) => Promise.resolve(['1']));
    const component = await act(async () => renderer.create(
      <Router>
        <WishlistPage id={45645645} />
      </Router>,
    ));
    await waitFor(() => act(() => {
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    }));
  });

  test('user doesn\'t have wishlist', async () => {
    getWishlist.mockImplementation((id) => Promise.resolve([]));

    const component = await act(async () => renderer.create(
      <Router>
        <WishlistPage id={12312312} />
      </Router>,
    ));
    await waitFor(() => act(() => {
      const tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    }));
  });
});

describe('WishlistPage Delete Product', () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  test('when user click delete, the corresponding product disappear', async () => {
    let deleted = false;
    getWishlist.mockImplementation((id) => {
      if (deleted) {
        return Promise.resolve([]);
      }
      return Promise.resolve([1]);
    });

    deleteFromWishlist.mockImplementation((pennId, productId) => {
      deleted = true;
      return Promise.resolve([]);
    });

    act(() => render(
      <Router>
        <WishlistPage id={12312312} />
      </Router>,
    ));
    await waitFor(() => {
      expect(screen.getByText('Delete from List')).toBeInTheDocument();
    });
    act(() => {
      const button = screen.getByText('Delete from List');
      userEvent.click(button);
    });
    await waitFor(() => {
      const noProdText = 'It seems you have no product in your Wishlist.';
      expect(screen.getByText(noProdText)).toBeInTheDocument();
    });
  });
});
