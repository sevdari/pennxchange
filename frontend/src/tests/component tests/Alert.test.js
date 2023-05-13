/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Alert from '../../components/Alert';

test('Alert renders correctly', async () => {
  let show = true;
  const setShow = (newValue) => { show = newValue; };

  render(<Alert message="test alert" setShowAlert={setShow} />);

  // check basic elements
  expect(screen.getByText(/PennXchange/)).toBeInTheDocument();
  expect(screen.getByText(/test alert/)).toBeInTheDocument();
  expect(screen.getByTestId('close-alert')).toBeInTheDocument();

  // when user clicks on close button, `setShow` should be called
  act(() => {
    userEvent.click(screen.getByTestId('close-alert'));
    expect(show).toBe(false);
  });
});