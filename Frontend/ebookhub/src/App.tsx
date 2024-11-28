import React, { useState } from 'react';
import AppRoutes from './Router';
import Modal from './components/Modal';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import Navbar from './components/Navbar/Navbar';

const App: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('accessToken');

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  const handleModalOpen = (type: 'login' | 'signup') => {
    type === 'login' ? setIsLoginOpen(true) : setIsSignupOpen(true);
  };

  const handleModalClose = (type: 'login' | 'signup') => {
    type === 'login' ? setIsLoginOpen(false) : setIsSignupOpen(false);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        onOpenModal={handleModalOpen}
      />

      {/* Routes */}
      <AppRoutes isLoggedIn={isLoggedIn} />

      {/* Modals */}
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
  );
};

export default App;
