import React from 'react';
import './LoginPage.css';

const LoginPage: React.FC = () => (
  <div className="login-page"> 
    <h1>Login</h1>
    <form>
      <label>
        Username or Email:
        <input type="username_email" name="username_email" />
      </label>
      <label>
        Password:
        <input type="password" name="password" />
      </label>
      <button type="submit">Login</button>
    </form>
  </div>
);

export default LoginPage;
