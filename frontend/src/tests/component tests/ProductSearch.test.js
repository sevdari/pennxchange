/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import Router, { BrowserRouter } from 'react-router-dom';
import {
  render, screen, act, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import HomePage from '../../components/HomePage';
import Search from '../../components/Search';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// describe('Search', () => {
//   test('corresponding values are displayed when user enters the search keywords', async () => {
//     render(<BrowserRouter><HomePage /></BrowserRouter>);
//     const search = screen.getByPlaceholderText('Search');
//     await userEvent.type(search, 'book');
//     expect(search).toHaveValue('book');
//   });
//   test('alert when search icon is pressed with no input value', async () => {
//     render(<Router><HomePage /></Router>);
//     const search = screen.getByPlaceholderText('Search');
//     await userEvent.click(search);
//     expect(screen.getByText('Search keyword cannot be empty!')).toBeInTheDocument();
//   })
// });

describe('Results', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // test('results not found', async () => {
  //   render(<Router><HomePage /></Router>);
  //   const search = screen.getByPlaceholderText('Search');
  //   await userEvent.type(search, 'abc');
  //   const searchIcon = screen.getByTestId('header-searchicon-svg');
  //   userEvent.click(searchIcon);
  //   expect(screen.getByText('Oops, no result found...')).toBeInTheDocument();
  // });
  test('results found', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    expect(screen.getByText('Sort by Price')).toBeInTheDocument();
  });
});

describe('Filters', () => {
  test('prices are sorted from low to high', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Sort by Price').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'descending');
    });
    await waitFor(() => {
      const component = screen.getByText('Price: High to Low');
      expect(component).toBeInTheDocument();
    });
  });
  test('prices are sorted from high to low', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Sort by Price').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'ascending');
    });
    await waitFor(() => {
      const component = screen.getByText('Price: High to Low');
      expect(component).toBeInTheDocument();
    });
  });
  test('posted time is sorted by old to new', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Sort by Time').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'ascending');
    });
    await waitFor(() => {
      const component = screen.getByText('Oldest to Newest');
      expect(component).toBeInTheDocument();
    });
  });
  test('posted time is sorted by new to old', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Sort by Time').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'descending');
    });
    await waitFor(() => {
      const component = screen.getByText('Newest to Oldest');
      expect(component).toBeInTheDocument();
    });
  });
  test('products are sorted alphabetically A-Z', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Sort by Name').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'ascending');
    });
    await waitFor(() => {
      const component = screen.getByText('A-Z');
      expect(component).toBeInTheDocument();
    });
  });
  test('products are sorted alphabetically Z-A', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Sort by Name').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'descending');
    });
    await waitFor(() => {
      const component = screen.getByText('Z-A');
      expect(component).toBeInTheDocument();
    });
  });
  test('products are sorted based on Used to New condition', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Filter by Condition').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'ascending');
    });
    await waitFor(() => {
      const component = screen.getByText('Used to New');
      expect(component).toBeInTheDocument();
    });
  });
  test('products are sorted based on New to Used condition', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Filter by Condition').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'descending');
    });
    await waitFor(() => {
      const component = screen.getByText('New to Used');
      expect(component).toBeInTheDocument();
    });
  });
  test('default price behaviors', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ searchTerm: 'kitchen' });
    render(<BrowserRouter><Search /></BrowserRouter>);
    const selectElement = screen.getByText('Sort by Price').closest('select');
    act(() => {
      userEvent.selectOptions(selectElement, 'ascending');
      userEvent.selectOptions(selectElement, 'default');
    });
    await waitFor(() => {
      const component = screen.getByText('Sort by Price');
      expect(component).toBeInTheDocument();
    });
  });
});
