import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container">
      <div className="text-center">
        <h1>Welcome to Ebookhub</h1>
        <p>Your one-stop platform for authors and readers alike.</p>

        <div className="button-container">
          <Link to="/author" className="routingButton">
            Author Mode
          </Link>
          <Link to="/reader" className="routingButton">
            Reader Mode
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
