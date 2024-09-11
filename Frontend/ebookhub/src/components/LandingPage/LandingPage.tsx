import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; 

const LandingPage: React.FC = () => {
  return (
    <div className="landing-container d-flex justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="mb-4">Welcome to Ebookhub</h1>
        <p className="mb-4">Your one-stop platform for authors and readers alike.</p>

        <div className="d-flex justify-content-center">
          <Link to="/author" className="btn btn-primary btn-lg mx-2">
            Author Mode
          </Link>
          <Link to="/reader" className="btn btn-secondary btn-lg mx-2">
            Reader Mode
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
