import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ChatHistory.css';
import { getUserByUsername } from '../api/userCalls';

function ChatHistory({
  contacts, setActiveContact,
}) {
  const [showAlert, setShowAlert] = useState(false);
  const handleClick = (e) => {
    setActiveContact(e.target.getAttribute('data-key'));
  };
  const handleKeyDown = async (e) => {
    // not fully implemented yet
    if (e.key === 'Enter') {
      if (e.target.value === '') {
        return;
      }
      const response = await getUserByUsername(e.target.value);
      if (response) {
        setActiveContact(response.pennId);
      } else {
        setShowAlert(true);
      }
    }
  };

  const handleOnChange = () => setShowAlert(false);

  const displayContacts = () => {
    if (contacts.length === 0) {
      return (
        <p key={0}>No contacts</p>
      );
    }
    return (
      [...contacts].map((contact) => (
        <p key={contact.pennId} data-key={contact.pennId} className="chat-contact-item">{contact.username}</p>
      ))
    );
  };

  useEffect(() => {
    const elements = document.querySelectorAll('.chat-contact-item');
    elements.forEach((element) => {
      element.addEventListener('click', handleClick);
    });

    return () => {
      elements.forEach((element) => {
        element.removeEventListener('click', handleClick);
      });
    };
  }, [contacts]);
  return (
    <div className="chat-history">
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">@</span>
        </div>
        <input type="text" className="form-control" placeholder="Username + Enter" aria-label="Username" aria-describedby="basic-addon1" onKeyDown={handleKeyDown} onChange={handleOnChange} />
      </div>
      {showAlert && <span className="chat-history-alert">User does not exist.</span>}
      {displayContacts()}
    </div>
  );
}

ChatHistory.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string,
  })).isRequired,
  setActiveContact: PropTypes.func.isRequired,
};
export default ChatHistory;
