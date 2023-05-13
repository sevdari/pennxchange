import React from 'react';

/**
 * This is a helper function, given rating,
 * return a list of html objects representing star rating
 * @param {*} rating an integer from 0 to 5
 * @returns a list of html objects, each representing a star
 */
function makeRatingStars(rating) {
  const emptyStar = (key) => <span key={key}>&#9734;</span>;
  const filledStar = (key) => <span key={key}>&#9733;</span>;
  const starString = [];
  // build star rating html object using loop
  for (let i = 0; i < 5; i += 1) {
    if (i < rating) {
      starString.push(filledStar(i));
    } else {
      starString.push(emptyStar(i));
    }
  }
  return starString;
}

export default makeRatingStars;
