/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { getByPlaceholderText, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import SignUp from '../../components/SignUp';

describe('Component rendering tests', () => {
  test('renders logo', () => {
    const { getByAltText } = render(<Router><SignUp /></Router>);
    const logo = getByAltText('logo');
    expect(logo).toBeInTheDocument;
  });

  test('renders slogan', () => {
    const { getByText } = render(<Router><SignUp /></Router>);
    const slogan = getByText('Empowering Students with Affordable Pre-Loved Treasures.');
    expect(slogan).toBeInTheDocument;
  });

  test('renders email', () => {
    const { getByPlaceholderText } = render(<Router><SignUp /></Router>);
    const email = getByPlaceholderText('example@gmail.com');
    expect(email).toBeInTheDocument;
  });

  test('renders username', () => {
    const { getByPlaceholderText } = render(<Router><SignUp /></Router>);
    const username = getByPlaceholderText('Adam');
    expect(username).toBeInTheDocument;
  });

  test('renders penn ID', () => {
    const { getByPlaceholderText } = render(<Router><SignUp /></Router>);
    const pennID = getByPlaceholderText('*********');
    expect(pennID).toBeInTheDocument;
  });

  test('renders join button', () => {
    const { getByText } = render(<Router><SignUp /></Router>);
    const join = getByText('Join the Community!');
    expect(join).toBeInTheDocument;
  });

  test('renders back to login', () => {
    const { getByText } = render(<Router><SignUp /></Router>);
    const login = getByText('Back to Login');
    expect(login).toBeInTheDocument;
  });
})

describe('Component rendering tests', () => {
  test('typing fills in email', async () => {
    render(<Router><SignUp /></Router>);
    const email = screen.getByPlaceholderText('example@gmail.com');
    expect(email.value).toBe('');

    await userEvent.type(email, 'a');
    expect(email.value).toBe('a');
  });

  test('typing fills in username', async () => {
    render(<Router><SignUp /></Router>);
    const username = screen.getByPlaceholderText('Adam');
    expect(username.value).toBe('');

    await userEvent.type(username, 'a');
    expect(username.value).toBe('a');
  });

  test('typing fills in pennID', async () => {
    render(<Router><SignUp /></Router>);
    const pennID = screen.getByPlaceholderText('12345678');
    expect(pennID.value).toBe('');

    await userEvent.type(pennID, 'a');
    expect(pennID.value).toBe('a');
  });

  test('typing fills in password', async () => {
    render(<Router><SignUp /></Router>);
    const password = screen.getByPlaceholderText('*********');
    expect(password.value).toBe('');

    await userEvent.type(password, 'a');
    expect(password.value).toBe('a');
  });

  test('login button causes username to disappear', async () => {
    render(<Router><SignUp /></Router>);
    const username = screen.getByPlaceholderText('Adam');
    expect(username.value).toBe('');

    await userEvent.type(username, 'a');
    expect(username.value).toBe('a');

    const login = screen.getByText('Back to Login');
    await userEvent.click(login);

    expect(username).not.toBeInTheDocument;
  });

  test('login button causes password to disappear', async () => {
    render(<Router><SignUp /></Router>);
    const password = screen.getByPlaceholderText('12345678');
    expect(password.value).toBe('');

    await userEvent.type(password, 'a');
    expect(password.value).toBe('a');

    const login = screen.getByText('Back to Login');
    await userEvent.click(login);

    expect(password).not.toBeInTheDocument;
  });

  test('login register with missing credentials doesnt cause disappearance', async () => {
    render(<Router><SignUp /></Router>);
    const username = screen.getByPlaceholderText('Adam');
    expect(username.value).toBe('');

    await userEvent.type(username, 'a');
    expect(username.value).toBe('a');

    const join = screen.getByText('Join the Community!');
    await userEvent.click(join);

    expect(username).toBeInTheDocument;
  });
})
