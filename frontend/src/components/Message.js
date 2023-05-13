import React from 'react';
import { PropTypes } from 'prop-types';
import './Message.css';
import { dayDifference } from '../utils/TimeFunctions';

// the basic Message component
function Message({ message }) {
  return (
    // eslint-disable-next-line no-underscore-dangle
    <div className={`message-${message.role}`} key={message._id}>
      <div className="message-main">
        <div className="message-img">
          <img src={message.imgAdd} alt="Profile" />
        </div>
        <div className="message-box">
          <p>
            {message.content}
          </p>
        </div>
        <div className="message-time">
          <p>
            {dayDifference(message.time)}
          </p>
        </div>
      </div>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.shape(
    {
      content: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      imgAdd: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      _id: PropTypes.string.isRequired,
    },
  ).isRequired,
};

export default Message;
