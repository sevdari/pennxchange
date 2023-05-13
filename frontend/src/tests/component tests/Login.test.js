/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-test-renderer';

import Login from '../../components/Login';

jest.mock('../../api/userCalls');
const setIsAuthenticated = jest.fn();

// https://dev.to/raphaelchaula/a-simple-image-test-in-react-3p6f
// https://stackoverflow.com/questions/63000516/how-to-getbyrole-a-button-with-image-in-react-testing-library

// Component Rendering Tests
describe('Component rendering tests', () => {
  test('renders login image', () => {
    const { getByAltText } = render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const image = getByAltText('login-img-alt');
    expect(image).toBeInTheDocument;
  });

  test('renders logo', () => {
    const { getByAltText } = render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const logo = getByAltText('logo-alt');
    expect(logo).toBeInTheDocument;
  });

  test('renders slogan', () => {
    const { getByText } = render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const logo = getByText('Empowering Students with Affordable Pre-Loved Treasures.');
    expect(logo).toBeInTheDocument;
  });

  test('renders login button', () => {
    const { getByText } = render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const loginButton = getByText('Login');
    expect(loginButton).toBeInTheDocument;
  });

  test('renders forgot password button', () => {
    const { getByText } = render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const forgotPasswordButton = getByText('Forgot your password?');
    expect(forgotPasswordButton).toBeInTheDocument;
  });

  test('renders signup button', () => {
    const { getByText } = render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const signUpButton = getByText('Sign up for a new account!');
    expect(signUpButton).toBeInTheDocument;
  });
});

// Component Functionality Tests
// https://stackoverflow.com/questions/65986454/how-to-fetch-element-with-name-attribute-in-react-testing-library
// https://testing-library.com/docs/user-event/keyboard/
describe('Component functionality tests', () => {
  test('typing pennID populates input', async () => {
    render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const username = screen.getByPlaceholderText('12345678');
    expect(username.value).toBe('');
    await userEvent.type(username, 'a');

    expect(username.value).toBe('a');
  });

  test('typing password populates input', async () => {
    render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const password = screen.getByPlaceholderText('********');
    expect(password.value).toBe('');

    await userEvent.type(password, 'b');

    expect(password.value).toBe('b');
  });

  test('missing credentials causes error to pop up', () => {
    render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const pennID = screen.getByPlaceholderText('12345678');
    userEvent.type(pennID, 'a');

    const element = screen.getByText('Login');
    act(() => userEvent.click(element));

    const message = screen.getByPlaceholderText('12345678');
    expect(message.value).toBe('');
  });

  test('incorrect credentials causes error to pop up', async () => {
    render(<Router><Login setIsAuthenticated={setIsAuthenticated}/></Router>);
    const username = screen.getByPlaceholderText('12345678');
    userEvent.type(username, 'a');

    const password = screen.getByPlaceholderText('********');
    userEvent.type(password, 'b');

    expect(username.value).toBe('a');
    expect(password.value).toBe('b');

    const loginButton = screen.getByText('Login');
    act(() => userEvent.click(loginButton));
    await waitFor(() => expect(screen.getByPlaceholderText('12345678').value).toBe(''));
  });
});
