import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import AuthorMode from './components/AuthorMode/AuthorMode';
import ReaderMode from './components/ReaderMode/ReaderMode';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import Modal from './components/Modal';


const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <Router>
      <div>
        {/* Custom Navbar */}
        <nav className="navbar">
          <div className="container">
            <Link className="navbar-brand" to="/">Ebookhub</Link>
            <div className="navbar-buttons">
              <button className="navbar-button" onClick={() => setIsLoginOpen(true)}>Login</button>
              <button className="navbar-button" onClick={() => setIsSignupOpen(true)}>Sign Up</button>
            </div>
          </div>
        </nav>

        {/* Routes for different pages */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/author" element={<AuthorMode />} />
          <Route path="/reader" element={<ReaderMode />} />
        </Routes>

        {/* Modal for Login */}
        <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
          <LoginPage />
        </Modal>

        {/* Modal for Signup */}
        <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
          <SignupPage />
        </Modal>
      </div>
    </Router>
  );
};

export default App;
