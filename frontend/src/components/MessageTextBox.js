import React, { useRef, useState } from 'react';
import './MessageTextBox.css';
import PropTypes from 'prop-types';
import Alert from './Alert';

import { addMessage } from '../api/message';

function MessageTextBox({
  messages, setMessages, sender, receiver,
}) {
  // keep hold of the current message in the text box
  const currentMessage = useRef('');

  // whether or not to show the alert
  const [showAlert, setShowAlert] = useState(false);

  // handle the click event
  const handleOnClick = (e) => {
    e.preventDefault();
    // check for empty form.
    if (currentMessage.current === '') {
      document.getElementById('chat').placeholder = 'Please enter a message';
    } else {
      // create a new message object
      const time = new Date();
      let newMessage = {
        content: currentMessage.current,
        time: time.toISOString(),
        sender,
        receiver,
      };
      // add the new message to the database
      // clear the text box
      document.getElementById('chat').value = '';
      const postMessage = async () => {
        try {
          // make a post request to add the message to the database
          const response = await addMessage(newMessage);
          newMessage = response.data;
          // lift up state
          setMessages([...messages, newMessage]);
        } catch (err) {
          // alert('Error: Message could not be sent');
          setShowAlert(true);
        }
      };
      postMessage();
    }
  };

  // reassings the value of the current message.
  const handleOnChange = (e) => {
    currentMessage.current = e.target.value;
  };

  return (
    <div className="form-group">
      <textarea className="form-control" id="chat" rows="3" onChange={handleOnChange} />
      <div className="button-container">
        <button data-testid="chat-submit" type="submit" className="btn btn-primary" onClick={handleOnClick}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
          </svg>
        </button>
      </div>
      {showAlert ? <Alert message="Error: Message could not be sent" setShowAlert={setShowAlert} /> : null}
    </div>
  );
}

MessageTextBox.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape(
    {
      content: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      imgAdd: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    },
  )).isRequired,
  setMessages: PropTypes.func.isRequired,
  sender: PropTypes.number,
  receiver: PropTypes.number,
};
MessageTextBox.defaultProps = {
  sender: null,
  receiver: null,
};

export default MessageTextBox;
