/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddReview from '../../components/AddReview';
import { addReview } from '../../api/reviewCalls';
import { act } from 'react-dom/test-utils';

jest.mock('../../api/reviewCalls');
addReview.mockResolvedValue({});

test('AddReview button is rendered', () => {
  render(<AddReview />);
  expect(screen.getByTestId('add-review-button')).toBeInTheDocument();
});


test('Users opens and closes Modal', async () => {
  render(<AddReview />);

  act(() => {
  userEvent.click(screen.getByTestId('add-review-button'));
  });
  await waitFor(() => {
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
  });

  act(() => {
  userEvent.click(screen.getByTestId('close-modal-button'));
  });
  await waitFor(() => {
    expect(screen.queryByText('Rating')).toBeNull();
  });
});

test('Simulate user review', async () => {
  render(<AddReview />);
  act( () => {
    userEvent.click(screen.getByTestId('add-review-button'));
  });
  userEvent.type(screen.getByTestId('review-input'), 'This is a test review');
  await waitFor(() => {
    expect(screen.getByTestId('review-input')).toHaveValue('This is a test review');
  });
  userEvent.selectOptions(screen.getByTestId('review-rating'), '5');
  await waitFor(() => {
    expect(screen.getByTestId('review-rating')).toHaveValue('5');
  });
  act( () => {
    userEvent.click(screen.getByTestId('submit-review-button'));
  });
  expect(addReview).toHaveBeenCalled();
});
