import React from 'react';
import './SignupPage.css';

const SignupPage: React.FC = () => (
  <div className="signup-page">
    <h1>Sign Up</h1>
    <form>
      <label>
        Email:
        <input type="email" name="email" />
      </label>

      <div className="tooltip">
        <label>
          Username:
          <input
            type="text"
            name="username"
          />
        </label>
        <span className="tooltiptext">Username must be unique</span>
      </div>

      <div className="tooltip">
        <label>
          Password:
          <input
            type="password"
            name="password"
          />
        </label>
        <span className="tooltiptext text-align-left">
          <ul>Password must have<li>8 Characters</li>  
            <li>Symbol '@#$'</li><li>Number '123'</li>
            <li>UPPERCASE </li><li>lowercase</li> </ul>
          </span>
      </div>

      <label>
        Full Name:
        <input type="text" name="fullName" />
      </label>

      <label>
        Role:
        <select name="role">
          <option value="author">Author</option>
          <option value="reader">Reader</option>
          <option value="both">Both</option>
        </select>
      </label>

      <button type="submit">Sign Up</button>
    </form>
  </div>
);

export default SignupPage;
