import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import AuthorMode from './components/AuthorMode/AuthorMode';
import ReaderMode from './components/ReaderMode/ReaderMode';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import BookDetail from './components/BookDetails/BookDetails';
import Modal from './components/Modal';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload(); // Refresh the page to update the UI
  };

  const toggleDropdown = () => {
    setShowDropdown(prev => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Router>
      <div>
        {/* Custom Navbar */}
        <nav className="navbar">
          <div className="container">
            <Link className="navbar-brand" to="/">Ebookhub</Link>
            <div className="navbar-buttons">
              {isLoggedIn ? (
                <>
                  <span
                    className="user-profile-logo"
                    title="User Profile"
                    onClick={toggleDropdown}
                  >
                    👤
                  </span>
                  {showDropdown && (
                    <div className="dropdown-menu" ref={dropdownRef}>
                      <button className="navbar-button" onClick={handleLogout}>Logout</button>
                      <Link to="/plugins" className="navbar-button-link">
                        <button className="navbar-button">Plugins</button>
                      </Link>
                      <Link to="/settings" className="navbar-button-link">
                        <button className="navbar-button">Setting</button>
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <button className="navbar-button" onClick={() => setIsLoginOpen(true)}>Login</button>
                  <button className="navbar-button" onClick={() => setIsSignupOpen(true)}>Sign Up</button>
                </>
              )}
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/books/:bookId" element={<BookDetail />} />
          <Route
            path="/author"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AuthorMode />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reader"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ReaderMode />
              </ProtectedRoute>
            }
          />
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
