import React from 'react';
import PropTypes from 'prop-types';

/**
 * A outline button with text. Text, color and event listener are passed in as props.
 * Usage: <BlueButton text={button text} color={color} handleOnClick={event handler} />
 *
 * @param {*} props - text, color and event handler
 * @returns a button with given text, color and event handler
 */
function OutlineButton({ text, color, handleOnClick }) {
  return (
    <button
      type="button"
      className="btn .btn-outline-*"
      style={{ color, borderColor: color }}
      onClick={handleOnClick}
    >
      {text}
    </button>
  );
}
OutlineButton.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  handleOnClick: PropTypes.func.isRequired,
};

export default OutlineButton;
