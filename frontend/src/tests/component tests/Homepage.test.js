/**
 * @jest-environment jsdom
 */

import React from 'react';
import axios from 'axios';
import '@testing-library/jest-dom/extend-expect';
// import testing library functions
import {
  render, screen, waitFor, act,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import MockAdapter from 'axios-mock-adapter';
import HomePage from '../../components/HomePage';
import { rootURL } from '../../utils/utils';

const mockAxios = new MockAdapter(axios);

// mock ProductsGrid so it does not make api call
jest.mock('../../components/ProductsGrid', () => {
  function ProductsGridMock(props) {
    const { products } = props;
    if (!products || products.length === 0) {
      return <div>No products available</div>;
    }
    return <div>At least one product!</div>;
  }
  return ProductsGridMock;
});

const mockData = {
  _id: '2',
  productImage: ['image'],
  productName: 'test',
  productPrice: 5.99,
  productDescription: 'test',
  productCategory: 'test',
  productPriceCategory: 'test',
  productPostedDate: 'test',
  productCondition: 'test',
  productSeller: 1,
};

describe('test component rendering', () => {
  beforeEach(() => {
    mockAxios.onGet(`${rootURL}/latestProducts`).reply(200, { data: [mockData] });
  });
  // afterEach(() => {
  //   mockAxios.reset();
  // });

  test('Homepage matches snapshot', async () => {
    // use 'act' to render the component HomePage, and do snapshot testing
    const component = await act(() => renderer.create(
      <Router>
        <HomePage />
      </Router>,
    ));
    const tree = component.toJSON();
    await waitFor(() => {
      act(() => expect(tree).toMatchSnapshot());
    });
  });

  test('Homepage contains at least product card', async () => {
    act(() => render(
      <Router>
        <HomePage />
      </Router>,
    ));
    await waitFor(() => {
      const card = screen.getByText(/At least one product!/);
      expect(card).not.toBeNull();
    });
  });
});
