import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => (
  <div>
    <h1>Welcome to the Platform</h1>
    <div>
      <Link to="/author">Author Mode</Link>
      <Link to="/reader">Reader Mode</Link>
    </div>
  </div>
);

export default LandingPage;
