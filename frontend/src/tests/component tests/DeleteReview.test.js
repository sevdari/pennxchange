/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addReview } from '../../api/reviewCalls';
import { act } from 'react-dom/test-utils';
import DeleteReview from '../../components/DeleteReview';

test('AddReview button is rendered', () => {
  render(<DeleteReview />);
  expect(screen.getByTestId('add-review-button')).toBeInTheDocument();
});

test('Users opens and closes Modal', async () => {
  render(<DeleteReview />);

  act(() => {
  userEvent.click(screen.getByTestId('add-review-button'));
  });
  await waitFor(() => {
    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
  });

  act(() => {
  userEvent.click(screen.getByTestId('delete-close'));
  });
  await waitFor(() => {
    expect(screen.queryByText('Are you sure')).toBeNull();
  });
});
