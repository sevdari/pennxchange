import React from 'react';
import PropTypes from 'prop-types';
import OutlineButton from './OutlineButton';
import { PennBlue, PennRed } from '../utils/Colors';
import { addWishlist, deleteFromWishlist } from '../api/wishlistCalls';
import { getUserIdFromToken } from '../api/userCalls';

function AddToWishlist({
  inWishlist, setInWishlist, idProduct,
}) {
  // const [inWishlist, setInWishlist] = useState(false);

  const handleAddToWishlist = async () => {
    setInWishlist(!inWishlist);
    // update the backend
    // get userId from session
    const userResponse = await getUserIdFromToken(sessionStorage.getItem('app-token'));
    if (userResponse) {
      addWishlist(userResponse.data, idProduct);
    }
  };

  const handleRemoveFromWishlist = async () => {
    setInWishlist(!inWishlist);
    // update the backend
    const userResponse = await getUserIdFromToken(sessionStorage.getItem('app-token'));
    if (userResponse) {
      deleteFromWishlist(userResponse.data, idProduct);
    }
    // currently hard-coded to user 12312312, will replace with userId once session is implemented
  };

  if (inWishlist === false) {
    return (
      <OutlineButton data-testid="add" text="Add to Wishlist" color={PennBlue} handleOnClick={handleAddToWishlist} />
    );
  }
  return (
    <OutlineButton data-testid="remove" text="Remove from Wishlist" color={PennRed} handleOnClick={handleRemoveFromWishlist} />
  );
}

AddToWishlist.propTypes = {
  inWishlist: PropTypes.bool.isRequired,
  setInWishlist: PropTypes.func.isRequired,
  idProduct: PropTypes.string.isRequired,
};

export default AddToWishlist;
