
/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import Charity from '../../components/Charity';

describe('Charity', () => {
  test ('contains description', () => {
    render(<Router><Charity /></Router>);
    expect(screen.getByText('About PennXchange')).toBeInTheDocument();
    expect(screen.getByText('SMALL ACTIONS')).toBeInTheDocument();
    expect(screen.getByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByText('Email Address:')).toBeInTheDocument();
    expect(screen.getByText('Phone Number: +1 (100) 100-0000')).toBeInTheDocument();
  });
   
  test ('Mail link works', () => {
    render(<Router><Charity /></Router>);
    const mailLink = screen.getByText('pennnxchange@gmail.com');
    expect(mailLink).toBeInTheDocument();
    expect(mailLink).toHaveAttribute('href', 'mailto:pennnxchange@gmail.com');
  });
});