import React, { useState } from 'react';
import { login } from '../../services/apiService';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [usernameEmail, setUsernameEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const data = await login(usernameEmail, password); // Use the login function
      // Save JWT tokens in local storage or cookies
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);
      console.log(data)
      
      
      setSuccess('You are logged in!'); // Set success message
      setError(''); // Clear any previous errors

      // Refresh the page after a short delay
      setTimeout(() => {
        window.location.reload(); // Reload the current page
      }, 1000); // 1-second delay
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Login failed');
      } else {
        setError('An unknown error occurred. Please try again.');
      }
      setSuccess(''); // Clear success message
    }
  };

  return (
    <div className="login-page">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>} {/* Show success message */}
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email:
          <input
            type="text"
            name="username_email"
            value={usernameEmail}
            onChange={(e) => setUsernameEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
