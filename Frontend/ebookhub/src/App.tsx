import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import AuthorMode from './components/AuthorMode/AuthorMode';
import ReaderMode from './components/ReaderMode/ReaderMode';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import Modal from './components/Modal';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <Router>
      <div>
        {/* Bootstrap Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Ebookhub</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button className="btn btn-outline-primary mx-2" onClick={() => setIsLoginOpen(true)}>Login</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-success mx-2" onClick={() => setIsSignupOpen(true)}>Sign Up</button>
                </li>
              </ul>
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
