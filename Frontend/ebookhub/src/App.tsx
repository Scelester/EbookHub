import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import AuthorMode from './components/AuthorMode/AuthorMode';
import ReaderMode from './components/ReaderMode/ReaderMode';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import BookDetail from './components/BookDetails/BookDetails';
import ReadChapter from './components/ReadChapter/ReadChapter';
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
    setShowDropdown((prev) => !prev);
  };

  const closeDropdown = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdown);
    return () => {
      document.removeEventListener('mousedown', closeDropdown);
    };
  }, []);

  const handleModalClose = (type: 'login' | 'signup') => {
    type === 'login' ? setIsLoginOpen(false) : setIsSignupOpen(false);
  };

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
          <Route path="/books/:book_id/c/:chapter_id" element={<ReadChapter />} />
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

        {/* Modal for Login/Signup */}
        {isLoginOpen && (
          <Modal isOpen={isLoginOpen} onClose={() => handleModalClose('login')}>
            <LoginPage />
          </Modal>
        )}

        {isSignupOpen && (
          <Modal isOpen={isSignupOpen} onClose={() => handleModalClose('signup')}>
            <SignupPage />
          </Modal>
        )}
      </div>
    </Router>
  );
};

export default App;
