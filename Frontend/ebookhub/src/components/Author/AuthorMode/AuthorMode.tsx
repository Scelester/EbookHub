import React, { useState } from 'react';
import UploadBook from '../UploadBook/UploadBook'; 
import AuthorBooks from '../AuthorBooks/AuthorBooks';
import WriteBook from '../WriteBook/WriteBook'; // Import the WriteBook component
import './AuthorMode.css';

const AuthorMode: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('yourBooks');

  // Function to handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  return (
    <div className="author-mode" id="author-mode">
      {/* Sidebar Navigation */}
      <div className="author-mode__sidebar" id="author-mode-sidebar">
        <div
          className={`sidebar-item ${activeSection === 'yourBooks' ? 'active' : ''}`}
          id="sidebar-your-books"
          onClick={() => handleSectionChange('yourBooks')}
        >
          <img
            src="/Your_books.png"
            alt="Your Books"
            className="sidebar-icon"
            id="your-books-icon"
          />
          <p className="sidebar-text" id="your-books-text">Your Books</p>
        </div>
        <div
          className={`sidebar-item ${activeSection === 'uploadBook' ? 'active' : ''}`}
          id="sidebar-upload-book"
          onClick={() => handleSectionChange('uploadBook')}
        >
          <img
            src="/Uploading_book.png"
            alt="Upload Book"
            className="sidebar-icon"
            id="upload-book-icon"
          />
          <p className="sidebar-text" id="upload-book-text">Upload Book</p>
        </div>
        <div
          className={`sidebar-item ${activeSection === 'writeBook' ? 'active' : ''}`}
          id="sidebar-write-book"
          onClick={() => handleSectionChange('writeBook')}
        >
          <img
            src="/writing_book.png"
            alt="Write a Book"
            className="sidebar-icon"
            id="write-book-icon"
          />
          <p className="sidebar-text" id="write-book-text">Write </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="author-mode__content" id="author-mode-content">
        {activeSection === 'yourBooks' && <AuthorBooks />}
        {activeSection === 'uploadBook' && <UploadBook />}
        {activeSection === 'writeBook' && <WriteBook />} {/* Render WriteBook */}
      </div>
    </div>
  );
};

export default AuthorMode;
