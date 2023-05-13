import React, { useEffect } from 'react';
// TODO: migrate to userCalls.js
import { getUser } from '../api/user';
import { getUserIdFromToken } from '../api/userCalls';
import ProfileSidebar from './ProfileSidebar';
import ProfilePostedProducts from './ProfilePostedProducts';
import ProfileInformation from './ProfileInformation';
import MessageBoard from './MessageBoard';
import './UserProfile.css';

function UserProfile() {
  // use active to keep track of which component to render
  const [active, setActive] = React.useState('info');
  const [user, setUser] = React.useState({ pennId: -1 });

  // get user info
  const [userId, setUserId] = React.useState(-1);
  useEffect(() => {
    const getUserWrapper = async () => {
      try {
        // decode app token to get userId
        const resp = await getUserIdFromToken(sessionStorage.getItem('app-token'));
        if (resp) {
          setUserId(resp.data);
        }

        const response = await getUser(userId);
        if (response && response.status === 200) {
          setUser(response.data.data);
        }
      } catch (err) {
        // console.log(err.mesage);
      }
    };
    getUserWrapper();
  }, [userId, user.pennId]);

  // display component based on active state
  const displayComponent = () => {
    if (active === 'info') {
      return <ProfileInformation user={user} setUser={setUser} />;
    } if (active === 'chats') {
      return <MessageBoard />;
    } if (active === 'posted') {
      return <ProfilePostedProducts userId={user.pennId} />;
    }
    return <div />;
  };
  // conditional rendering based on user existence
  if (!userId || userId === -1 || user.pennId === -1) {
    return (
      <div>
        <h1> Invalid user! Please login again. </h1>
      </div>
    );
  }
  return (
    <div>
      <div className="profile-main-wrapper">
        <div className="profile-user-profile">
          <ProfileSidebar
            setActive={setActive}
            username={user.username}
            profile={user.picture}
          />
          <div className="profile-main">
            {displayComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
