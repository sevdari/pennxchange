/**
 * @jest-environment jsdom
 */

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
// import testing library functions
import {
  render, screen, waitFor, act,
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import renderer from 'react-test-renderer';
import ProductDetail from '../../components/ProductDetail';

test('ProductDetail matches snapshot', async () => {
  // use 'act' to render the component ProductDetail, and do snapshot testing
  const component = await act(() => renderer.create(
    <Router>
      <ProductDetail productId={1} />
    </Router>,
  ));
  const tree = component.toJSON();
  await waitFor(() => {
    act(() => expect(tree).toMatchSnapshot());
  });
});

// needs mocking, commit it now
// test('Test if index change', async () => {
//   render(
//     <Router>
//       <ProductDetail productId={3} />
//     </Router>
//   );
//   await waitFor(() => expect(screen.getByTestId('carouselProductDetail1')).toBeInTheDocument());
//   await waitFor(() => expect(screen.getByTestId('carouselProductDetail0')).toBeInTheDocument());
// });
