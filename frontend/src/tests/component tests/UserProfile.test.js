/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  render, screen, act, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import UserProfile from '../../components/UserProfile';
import ProfileInformation from '../../components/ProfileInformation';
import { getUser, changeUser } from '../../api/user';
import { getUserIdFromToken } from '../../api/userCalls';

jest.mock('../../api/user');
jest.mock('../../api/userCalls');

describe('active state of the user', () => {
  test('error when user does not exist', () => {
    render(<Router><UserProfile /></Router>);
    expect(screen.getByText('Invalid user! Please login again.')).toBeInTheDocument();
  });
  test('shows main profile when user exists', async () => {
    getUserIdFromToken.mockResolvedValue({ status: 200, data: { data: 12312312 } });
    getUser.mockResolvedValue({
      status: 200,
      data: {
        data: {
          id: 1, username: 'jim', password: '12345', pennId: 12312312, email: 'maryam@gmail.com', picture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        },
      },
    });
    render(<Router><UserProfile /></Router>);
    await screen.findByText('Profile Information');
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
  });
  test('shows chat when user exists and active state is chat', async () => {
    // getUserIdFromToken.mockResolvedValue({ status: 200, data: { data: 12312312 } });
    // getUser.mockResolvedValue({
    //   status: 200,
    //   data: {
    //     data: {
    //       _id: 1, username: 'jim', password: '12345', pennId: 12312312, email: 'maryam@gmail.com', picture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
    //     },
    //   },
    // });
    // render(<Router><UserProfile /></Router>);
    // await act(() => { render(<Router><UserProfile /></Router>); });
    // await screen.findByText('Chats');
    // const button = screen.getByText('Chats');
    // await waitFor(() => { act(() => { userEvent.click(button); }); });
    // expect(screen.getByText('Chat')).toBeInTheDocument();
  });
  test('shows posted products when user exists and active state is posted', async () => {
    getUserIdFromToken.mockResolvedValue({ status: 200, data: { data: 12312312 } });
    getUser.mockResolvedValue({
      status: 200,
      data: {
        data: {
          id: 1, username: 'jim', password: '12345', pennId: 12312312, email: 'maryam@gmail.com', picture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
        },
      },
    });
    await act(() => { render(<Router><UserProfile /></Router>); });
    await screen.findAllByText('Posted Products');
    const button = screen.getByTestId('posted');
    await waitFor(() => { act(() => { userEvent.click(button); }); });
    expect(screen.getByTestId('posted-product-page')).toBeInTheDocument();
  });
});

describe('profile information', () => {
  const setUser = jest.fn();
  const user = {
    id: 1, username: 'jim', password: '12345', pennId: 12341234, email: 'maryam@gmail.com', picture: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
  };
  test('renders components correctly', () => {
    render(<Router><ProfileInformation user={user} setUser={setUser} /></Router>);
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Change Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Change Password')).toBeInTheDocument();
    expect(screen.getByText('Change Profile Picture')).toBeInTheDocument();
    expect(screen.getByText('Make Changes')).toBeInTheDocument();
  });
  test('retrieve the entered username', async () => {
    render(<Router><ProfileInformation user={user} setUser={setUser} /></Router>);
    const usernameInput = screen.getByPlaceholderText('Change Username');
    await userEvent.type(usernameInput, 'Adam');
    expect(usernameInput.value).toBe('Adam');
  });
  test('retrieve the entered password', async () => {
    render(<Router><ProfileInformation user={user} setUser={setUser} /></Router>);
    const passwordInput = screen.getByPlaceholderText('Change Password');
    await userEvent.type(passwordInput, '12345');
    expect(passwordInput.value).toBe('12345');
  });
  test('update the username and password', async () => {
    render(<Router><ProfileInformation user={user} setUser={setUser} /></Router>);
    const usernameInput = screen.getByPlaceholderText('Change Username');
    const passwordInput = screen.getByPlaceholderText('Change Password');
    const button = screen.getByText('Make Changes');
    await userEvent.type(usernameInput, 'Adam');
    await userEvent.type(passwordInput, '12345');
    await userEvent.click(button);
    expect(changeUser).toHaveBeenCalledTimes(1);
    expect(changeUser).toHaveBeenCalledWith(12341234, { ...user, username: 'Adam', password: '12345' });
  });
});
