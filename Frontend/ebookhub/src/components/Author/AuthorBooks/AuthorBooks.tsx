import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AuthorBooks.css';

// interface Chapter {
//   id: number;
//   chapter_title: string;
// }

interface Genre {
  id: number;
  name: string;
}

interface Book {
  id: number;
  title: string;
  author: { id: number; name: string; bio: string | null };
  publisher: number;
  description: string;
  genre: Genre[];
  cover_image_url: string;
  date_published: string;
  can_fork: boolean;
  rating: string | null;
  file: string;
}

const AuthorBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const publisherId = localStorage.getItem('user_id');
        if (!publisherId) {
          setError('Publisher ID not found in local storage.');
          setLoading(false);
          return;
        }
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/writers/mybooks/${publisherId}/`
        );
        setBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div className="author-books__loading">Loading books...</div>;
  }

  if (error) {
    return <div className="author-books__error">{error}</div>;
  }

  return (
    <div className="author-books">
      <h2>Your Books</h2>
      {books.length === 0 ? (
        <div className="author-books__empty">You haven't uploaded any books yet.</div>
      ) : (
        <div className="author-books__list">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              <img
                src={process.env.REACT_APP_API_URL + book.cover_image_url}
                alt={book.title}
                className="book-card__image"
              />
              <div className="book-card__details">
                <h3 className="book-card__title">{book.title}</h3>
                <p className="book-card__author">by {book.author.name}</p>
                <p className="book-card__genre">
                  Genre: {book.genre.map((g) => g.name).join(', ')}
                </p>
                <p className="book-card__date">
                  Published: {new Date(book.date_published).toLocaleDateString()}
                </p>
                {book.rating && <p className="book-card__rating">Rating: {book.rating}</p>}
                <a
                  href={process.env.REACT_APP_API_URL + book.file}
                  className="book-card__download"
                  download
                >
                  Download EPUB
                </a>
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuthorBooks;
