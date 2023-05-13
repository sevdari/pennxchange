/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { addReview } from '../../api/reviewCalls';
import { act } from 'react-dom/test-utils';
import ModifyReview from '../../components/ModifyReview';
import { modifyReview, getReview } from '../../api/reviewCalls';

jest.mock('../../api/reviewCalls');
modifyReview.mockResolvedValue({});
getReview.mockResolvedValue({
  buyerId: "12312312",
  content: "This is a safe seller!",
  id: 1,
  rating: "3",
  sellerId: "34534534"
});

test('EditReview button is rendered', () => {
  render(<ModifyReview reviewId={1}/>);
  expect(screen.getByTestId('edit-review-button')).toBeInTheDocument();
});

test('Users opens Modal and submits Review', async () => {
  render(<ModifyReview reviewId={1} />);

  act(() => {
    userEvent.click(screen.getByTestId('edit-review-button'));
  });

  await waitFor(() => {
    expect(screen.getByTestId('edit-save')).toBeInTheDocument();
  });

  act(() => {
    userEvent.selectOptions(screen.getByTestId('edit-rating'), '0');
  });

  await waitFor(() => {
    expect(screen.getByTestId('edit-rating')).toHaveValue('0');
  });

  act(() => {
    userEvent.click(screen.getByTestId('edit-save'));
  });

  await waitFor(() => {
    expect(screen.queryByText('Rating')).toBeNull();
  });
});
