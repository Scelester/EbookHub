import React from 'react';
import './SignupPage.css';

const SignupPage: React.FC = () => (
  <div>
    <h1>Sign Up</h1>
    <form>
      <label>
        Email:
        <input type="email" name="email" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Sign Up</button>
    </form>
  </div>
);

export default SignupPage;
