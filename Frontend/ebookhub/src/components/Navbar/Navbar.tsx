import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  isLoggedIn: boolean;
  onLogout: () => void;
  onOpenModal: (type: 'login' | 'signup') => void;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, onLogout, onOpenModal }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
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
                  <button className="navbar-button" onClick={onLogout}>Logout</button>
                  <Link to="/plugins" className="navbar-button-link">
                    <button className="navbar-button">Plugins</button>
                  </Link>
                  <Link to="/settings" className="navbar-button-link">
                    <button className="navbar-button">Settings</button>
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <button
                className="navbar-button"
                onClick={() => onOpenModal('login')}
              >
                Login
              </button>
              <button
                className="navbar-button"
                onClick={() => onOpenModal('signup')}
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
