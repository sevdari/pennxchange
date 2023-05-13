/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
// import testing library functions
import {
  render, screen, waitFor, act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderer from 'react-test-renderer';
import SimilarProducts from '../../components/SimilarProducts';
import { getSimilarProducts } from '../../api/productCalls';

jest.mock('../../api/productCalls', () => ({
  getSimilarProducts: jest.fn(),
}));

// mock the similarProducts api call
getSimilarProducts.mockImplementation((productId) => {
  switch (productId) {
    case '1a2b3c4d':
      return Promise.resolve([
        {
          _id: '11aa22bb',
          productImage: ['does not matter'],
          productName: 'Silverware',
          productPrice: 10.99,
          productDescription: '10 forks and 10 spoons',
          productCategory: 'Kitchen',
          productPriceCategory: 'Bid',
          productPostedDate: '2023-04-20T05:30:00Z',
          productCondition: 'Slightly Used',
          productSeller: 23423423,
        },
      ]);
    default:
      return Promise.resolve([]);
  }
});

// mock product simple, so that it doesn't make api calls
jest.mock('../../components/ProductCardDetailed', () => {
  function ProductCardDetailedMock() {
    return <div>happy testing</div>;
  }
  return ProductCardDetailedMock;
});

test('SimilarProducts matches snapshot', async () => {
  // use 'act' to render the component SimilarProducts, and do snapshot testing
  const component = await act(() => renderer.create(<SimilarProducts productId="1a2b3c4d" />));
  // wait for the component to finish rendering
  await waitFor(() => {
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
