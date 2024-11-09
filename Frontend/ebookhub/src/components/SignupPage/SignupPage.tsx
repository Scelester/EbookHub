import React, { useState } from 'react';
import { signup } from '../../services/apiService'; // Import the signup function
import './SignupPage.css';

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // New state for password confirmation
  const [fullName, setFullName] = useState(''); // Fullname state
  const [role, setRole] = useState('author');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Handle signup form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await signup(email, username, password, fullName, role); // Use the signup function
      setSuccess('Signup successful! You can now log in.');
      setError(''); // Clear any previous errors
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Signup failed. Please try again.');
      } else {
        setError('An unknown error occurred. Please try again.');
      }
      setSuccess(''); // Clear success message
    }
  };

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <div className="tooltip">
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <span className="tooltiptext">Username must be unique</span>
        </div>

        <label>
          Full Name:
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>

        <div className="tooltip">
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <span className="tooltiptext text-align-left">
            <ul>Password must have:
              <li>8 Characters</li>
              <li>Symbol '@#$'</li>
              <li>Number '123'</li>
              <li>UPPERCASE</li>
              <li>lowercase</li>
            </ul>
          </span>
        </div>

        <div className="tooltip">
          <label>
            Confirm Password:
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Role:
          <select
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="author">Author</option>
            <option value="reader">Reader</option>
            <option value="both">Both</option>
          </select>
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
