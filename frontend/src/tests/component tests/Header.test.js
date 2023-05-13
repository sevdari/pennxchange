/**
* @jest-environment jsdom
*/
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render, screen, act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { getUserIdFromToken, getUser } from '../../api/userCalls';

import Header from '../../components/Header';

jest.mock('../../api/userCalls', () => ({
  getUserIdFromToken: jest.fn(),
  getUser: jest.fn(),
}));

getUserIdFromToken.mockImplementation(() => Promise.resolve({ data: 123 }));
getUser.mockImplementation(() => Promise.resolve({ data: 'img does not matter' }));

describe('Component rendering tests', () => {
  test('logo div rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const logo = screen.getByTestId('header-logo-svg');
    expect(logo).toBeInTheDocument();
  });

  test('search input rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const search = screen.getByPlaceholderText('Search');
    expect(search).toBeInTheDocument();
  });

  test('search icon div rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const searchIcon = screen.getByTestId('header-searchicon-svg');
    expect(searchIcon).toBeInTheDocument();
  });

  test('dropdown rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const dropdown = screen.getByTestId('header-dropdown-svg');
    expect(dropdown).toBeInTheDocument();
  });

  test('user icon rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const userIcon = screen.getByAltText('user');
    expect(userIcon).toBeInTheDocument();
  });

  test('bathroom category rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const bathroom = screen.getByText('Bathroom');
    expect(bathroom).toBeInTheDocument();
  });

  test('bedroom category rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const bedroom = screen.getByText('Bedroom');
    expect(bedroom).toBeInTheDocument();
  });

  test('kitchen category rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const kitchen = screen.getByText('Kitchen');
    expect(kitchen).toBeInTheDocument();
  });

  test('electronics category rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const electronics = screen.getByText('Electronics');
    expect(electronics).toBeInTheDocument();
  });

  test('school supplies category rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const schoolSupplies = screen.getByText('School Supplies');
    expect(schoolSupplies).toBeInTheDocument();
  });

  test('other category rendered', () => {
    render(<Router><Header userId={123} /></Router>);
    const otherCategory = screen.getByText('Other');
    expect(otherCategory).toBeInTheDocument();
  });
});

describe('Functionality tests', () => {
  test('search rendered', async () => {
    render(<Router><Header userId={123} /></Router>);
    const search = await screen.getByPlaceholderText('Search');
    expect(search.value).toBe('');

    await userEvent.type(search, 'a');
    expect(search.value).toBe('a');
  });

  test('pressing dropdown', async () => {
    render(<Router><Header userId={123} /></Router>);
    const dropdown = screen.getByTestId('header-dropdown-svg');
    act(() => {
      userEvent.click(dropdown);
    });
    return (expect(screen.getByText('My Profile')).toBeInTheDocument);
  });

  test('pressing my products', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);
    const dropdown = screen.getByTestId('header-dropdown-svg');
    act(() => {
      userEvent.click(dropdown);
    });

    const myProducts = screen.getByTestId('test-myprofile');
    act(() => {
      userEvent.click(myProducts);
    });

    expect(global.window.location.pathname).toBe('/user');
  });

  test('pressing charity', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);
    const dropdown = screen.getByTestId('header-dropdown-svg');
    act(() => {
      userEvent.click(dropdown);
    });

    const charity = screen.getByTestId('test-charity');
    act(() => {
      userEvent.click(charity);
    });

    expect(global.window.location.pathname).toBe('/charity');
  });

  // comment below, this is not achievable by only rendering a Header
  // test('pressing log out', async () => {
  //   // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
  //   global.window ??= { location: { pathname: null } };
  //   const userId = 1;
  //   render(<Router><Header userId={userId} /></Router>);
  //   const dropdown = screen.getByTestId('header-dropdown-svg');
  //   act(() => {
  //     userEvent.click(dropdown);
  //   });

  //   const logOut = screen.getByTestId('test-logout');
  //   act(() => {
  //     userEvent.click(logOut);
  //   });

  //   expect(global.window.location.pathname).toBe('/login');
  // });

  test('pressing my wishlist', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);
    const dropdown = screen.getByTestId('header-dropdown-svg');
    act(() => {
      userEvent.click(dropdown);
    });

    const myWishlist = screen.getByTestId('test-mywishlist');
    act(() => {
      userEvent.click(myWishlist);
    });

    expect(global.window.location.pathname).toBe('/wishlist');
  });

  test('pressing bathroom category', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);

    const bathroom = screen.getByText('Bathroom');
    act(() => {
      userEvent.click(bathroom);
    });

    expect(global.window.location.pathname).toBe('/search/bathroom');
  });

  test('pressing bedroom category', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);

    const bedroom = screen.getByText('Bedroom');
    act(() => {
      userEvent.click(bedroom);
    });

    expect(global.window.location.pathname).toBe('/search/bedroom');
  });

  test('pressing kitchen category', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);

    const kitchen = screen.getByText('Kitchen');
    act(() => {
      userEvent.click(kitchen);
    });

    expect(global.window.location.pathname).toBe('/search/kitchen');
  });

  test('pressing electronics category', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);

    const electronics = screen.getByText('Electronics');
    act(() => {
      userEvent.click(electronics);
    });

    expect(global.window.location.pathname).toBe('/search/electronics');
  });

  test('pressing school supplies category', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);

    const schoolSupplies = screen.getByText('School Supplies');
    act(() => {
      userEvent.click(schoolSupplies);
    });

    expect(global.window.location.pathname).toBe('/search/school%20supplies');
  });

  test('pressing other category', async () => {
    // https://stackoverflow.com/questions/50977862/how-to-test-url-change-with-jest
    global.window ??= { location: { pathname: null } };
    const userId = 1;
    render(<Router><Header userId={userId} /></Router>);

    const otherCategory = screen.getByText('Other');
    act(() => {
      userEvent.click(otherCategory);
    });

    expect(global.window.location.pathname).toBe('/search/other');
  });
});
