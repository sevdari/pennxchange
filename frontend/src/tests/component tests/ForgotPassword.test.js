/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';
import ForgotPassword from '../../components/ForgotPassword';

jest.mock('../../api/userCalls');

describe ('Component rendering tests', () => {
  test('renders form', () => {
    const { container } = render(<Router><ForgotPassword /></Router>);
    const form = container.querySelector('fp-form');
    expect(form).toBeInTheDocument;
  });

  test('renders logo', () => {
    const { getByAltText } = render(<Router><ForgotPassword /></Router>);
    const logo = getByAltText('logo');
    expect(logo).toBeInTheDocument;
  });

  test('renders reset password button', () => {
    const { getByText } = render(<Router><ForgotPassword /></Router>);
    const resetButton = getByText('Reset Password');
    expect(resetButton).toBeInTheDocument;
  });

  test('renders have an issue', () => {
    const { getByText } = render(<Router><ForgotPassword /></Router>);
    const haveAnIssue = getByText('Have an issue?');
    expect(haveAnIssue).toBeInTheDocument;
  });

  test('renders call us', () => {
    const { getByText } = render(<Router><ForgotPassword /></Router>);
    const callUs = getByText('Call us at: +1-445-234-2385');
    expect(callUs).toBeInTheDocument;
  });

  test('renders back to login', () => {
    const { getByText } = render(<Router><ForgotPassword /></Router>);
    const backToLogin = getByText('Back to Login.');
    expect(backToLogin).toBeInTheDocument;
  });
})

describe ('Functionality tests', () => {
  test('typing in username populates input', async () => {
    render(<Router><ForgotPassword /></Router>);
    const username = screen.getByPlaceholderText('12345678');
    expect(username.value).toBe('');

    await userEvent.type(username, 'a');
    expect(username.value).toBe('a');
  });

  test('typing in password populates input', async () => {
    render(<Router><ForgotPassword /></Router>);
    const password = screen.getByPlaceholderText('********');
    expect(password.value).toBe('');

    await userEvent.type(password, 'a');
    expect(password.value).toBe('a');
  });

  test('missing credentials does not reset form', async () => {
    render(<Router><ForgotPassword /></Router>);

    const username = screen.getByPlaceholderText("12345678");
    await userEvent.type(username, 'a');
    expect(username.value).toBe('a');

    const resetButton = screen.getByText('Reset Password');
    await userEvent.click(resetButton);

    return(expect(screen.getByPlaceholderText("12345678").value).toBe('a'));
  });
})