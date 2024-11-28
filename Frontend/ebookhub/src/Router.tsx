import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import AuthorMode from './components/Author/AuthorMode/AuthorMode';
import ReaderMode from './components/Reader/ReaderMode/ReaderMode';
import LoginPage from './components/LoginPage/LoginPage';
import SignupPage from './components/SignupPage/SignupPage';
import BookDetail from './components/Reader/BookDetails/BookDetails';
import ReadChapter from './components/Reader/ReadChapter/ReadChapter';
import ProtectedRoute from './components/ProtectedRoute';

interface AppRoutesProps {
  isLoggedIn: boolean;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ isLoggedIn }) => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/books/:bookId" element={<BookDetail />} />
      <Route path="/books/:book_id/c/:chapter_id" element={<ReadChapter />} />
      <Route
        path="/author"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <AuthorMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reader"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <ReaderMode />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
