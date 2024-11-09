import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Modal from './Modal'; // Ensure this path is correct

interface ProtectedRouteProps {
  children: JSX.Element;
  isLoggedIn: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isLoggedIn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
    }
  }, [isLoggedIn]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShouldRedirect(true); 
  };

  if (!isLoggedIn) {
    if (shouldRedirect) {
      return <Navigate to="/" />;
    }

    return (
      <>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2>Please login or signup to access this page.</h2>
        </Modal>
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
