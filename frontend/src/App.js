import React, { useState } from 'react';
import {
  BrowserRouter as Router, Route, Routes,
} from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
// import bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import ForgotPassword from './components/ForgotPassword';
import Login from './components/Login';
import SignUp from './components/SignUp';
import ViewProduct from './components/ViewProduct';
import UserProfile from './components/UserProfile';
import MessageBoard from './components/MessageBoard';
import WishlistPage from './components/WishlistPage';
import Charity from './components/Charity';
import HomePage from './components/HomePage';
import ProductUpload from './components/ProductUpload';
import Search from './components/Search';
import Chat from './components/Chat';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(sessionStorage.getItem('app-token') !== null);

  // if not authenticated, always direct to login, otherwise, direct to home
  if (!isAuthenticated) {
    return (
      <Router>
        <div className="App">
          <Routes>
            <Route path="/signup" element={<SignUp />} exact />
            <Route path="/forgotpassword" element={<ForgotPassword />} exact />
            <Route path="*" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          </Routes>
        </div>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/home" element={<HomePage />} exact />
          <Route path="/" element={<HomePage />} exact />
          <Route path="/login" element={<HomePage />} exact />
          {/*
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} exact />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} exact />
          */}
          <Route path="/signup" element={<SignUp />} exact />
          <Route path="/forgotpassword" element={<ForgotPassword />} exact />
          <Route path="/product/:productIdInParam" element={<ViewProduct />} exact />
          <Route path="/charity" element={<Charity />} exact />
          <Route path="/user" element={<UserProfile />} exact />
          <Route path="/chats" element={<MessageBoard />} exact />
          <Route path="/wishlist" element={<WishlistPage />} exact />
          <Route path="*" element={<div><h1>404 Not Found</h1></div>} />
          <Route path="/addProduct" element={<ProductUpload />} exact />
          <Route path="/modifyProduct/:productIdInParam" element={<ProductUpload modify />} exact />
          <Route path="/chat" element={<Chat />} exact />
          <Route path="/search">
            <Route path=":searchTerm" element={<Search />} exact />
          </Route>
        </Routes>
        <Footer />
        {isAuthenticated && (
          <div style={{ padding: '15px' }}>
            <hr style={{ width: '1px' }} />
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
