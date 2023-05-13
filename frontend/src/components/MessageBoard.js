/* eslint-disable no-param-reassign */
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './MessageBoard.css';
import { getUser, getUserIdFromToken } from '../api/userCalls';

// import api calls
import { getChatHistory } from '../api/message';

// import other components
import Message from './Message';
import MessageTextBox from './MessageTextBox';

function MessageBoard({
  activeContact,
}) {
  // define a state for messages
  // initialize it with the messagelist for now.
  const [messages, setMessages] = useState([]);

  // create an array of Message components
  const messageComponents = [];

  // Feature from scrolling to the bottom of the chat.
  // idea from https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // define sender and receiver
  const sender = useRef(null);
  const receiver = useRef(null);

  // fetch messages from backend
  useEffect(() => {
    const getMessages = async () => {
      if (!activeContact) {
        return;
      }
      receiver.current = await getUser(activeContact).then((response) => response.data);
      sender.current = await getUserIdFromToken(sessionStorage.getItem('app-token')).then(
        (response) => getUser(response.data).then((user) => user.data),
      );
      const response = await getChatHistory(sender.current.pennId, receiver.current.pennId);
      if (response && response.data.data) {
        setMessages(response.data.data);
      }
    };
    getMessages();
    scrollToBottom();
    const intervalID = setInterval(() => {
      getMessages();
    }, 1000);
    return () => clearInterval(intervalID);
  }, [messages.length, activeContact]);

  // fill array with Message components
  if (sender.current && receiver.current) {
    messages.forEach((message) => {
      // hacky solution for now. will change once we have a proper database.
      if (message.sender === receiver.current.pennId) {
        message.role = 'receiver';
        message.imgAdd = receiver.current.picture;
      } else {
        message.role = 'sender';
        message.imgAdd = sender.current.picture;
      }
      // eslint-disable-next-line no-underscore-dangle
      messageComponents.push(<Message message={message} key={message._id} setKey={message._id} />);
    });
  }

  return (
    <div className="board-container">
      <div className="message-board">
        <h1>
          {
            receiver.current ? receiver.current.username : 'Select a contact to start chatting!'
          }
        </h1>
        <div className="board-messages">
          {messageComponents}
          <div ref={messagesEndRef} />
        </div>
        <MessageTextBox
          messages={messages}
          setMessages={setMessages}
          sender={sender.current ? sender.current.pennId : null}
          receiver={receiver.current ? receiver.current.pennId : null}
        />
      </div>
    </div>
  );
}

MessageBoard.propTypes = {
  activeContact: PropTypes.string,
};
MessageBoard.defaultProps = {
  activeContact: null,
};
export default MessageBoard;
