import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import './Chat.css';
import ChatHistory from './ChatHistory';
import MessageBoard from './MessageBoard';
// import ProfileSidebar from './ProfileSidebar';
import { getContacts } from '../api/message';
import { getUser, getUserIdFromToken } from '../api/userCalls';

function Chat() {
  // eslint-disable-next-line no-unused-vars
  const [contacts, setContacts] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [activeContact, setActiveContact] = useState(null);
  useEffect(() => {
    const fetchContacts = async () => {
      // get user id from token
      const currentUser = await getUserIdFromToken(sessionStorage.getItem('app-token'));
      // get contacts information
      const resp = await getContacts(currentUser.data).then((response) => {
        const getUserInfoPromises = response.data.data.map((id) => getUser(id));

        return Promise.all(getUserInfoPromises)
          .then((usersInfo) => usersInfo)
          .catch(() => []);
      });
      if (resp.length > 0) {
        setContacts(resp.map((user) => user.data));
      }
      // setContacts(response.data.data);
    };
    fetchContacts();
  }, []);
  return (
    <div>
      <div className="chat-main-wrapper">
        <div className="chat-main">
          <div className="chat-sidebar">
            <ChatHistory contacts={contacts} setActiveContact={setActiveContact} />
          </div>
          <div className="chat-message">
            <MessageBoard activeContact={activeContact} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
