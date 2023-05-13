/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import Footer from '../../components/Footer';

describe('Render components', () => {
  test('About us', () => {
    render(<Router><Footer /></Router>);
    const aboutUs = screen.getByText('About Us');
    expect(aboutUs).toBeInTheDocument;
  });

  test('Contact', () => {
    render(<Router><Footer /></Router>);
    const contact = screen.getByText('Contact');
    expect(contact).toBeInTheDocument;
  });

  test('Donate', () => {
    render(<Router><Footer /></Router>);
    const donate = screen.getByText('Donate');
    expect(donate).toBeInTheDocument;
  });

  test('UPenn', () => {
    render(<Router><Footer /></Router>);
    const upenn = screen.getByText('UPenn');
    expect(upenn).toBeInTheDocument;
  });
})

describe('Button redirects', () => {
  test('About us footer still there', () => {
    render(<Router><Footer /></Router>);
    const aboutUs = screen.getByText('About Us');
    act(() => userEvent.click(aboutUs));
    expect(screen.queryByText('About Us')).not.toEqual(null);
  });

  test('Contact footer still there', () => {
    render(<Router><Footer /></Router>);
    const contact = screen.getByText('Contact');
    act(() => userEvent.click(contact));
    expect(screen.queryByText('Contact')).not.toEqual(null);
  });

  test('Donate footer still there', () => {
    render(<Router><Footer /></Router>);
    const donate = screen.getByText('Donate');
    act(() => userEvent.click(donate));
    expect(screen.queryByText('Donate')).not.toEqual(null);
  });
})