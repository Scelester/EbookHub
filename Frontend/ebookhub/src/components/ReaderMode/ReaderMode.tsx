import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ReaderMode.css'

const BASE_URL = process.env.REACT_APP_API_URL;

interface Book {
  id: number;
  title: string;
  author: number;
  description: string;
  genre: number[];
  cover_image_url: string;
  date_published: string;
  rating: string;
  chapters: Array<{
    id: number;
    chapter_title: string;
    content: string;
  }>;
}

interface BookWithNames extends Book {
  authorName: string;
  genreNames: string[];
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

const ReaderMode: React.FC = () => {
  const [books, setBooks] = useState<BookWithNames[]>([]);
  const [category, setCategory] = useState<string>('all');
  const storedUserId = localStorage.getItem('user_id');
  const userId = storedUserId ? parseInt(storedUserId, 10) : 0;
  const [pagination, setPagination] = useState<{
    next: string | null;
    previous: string | null;
  }>({
    next: null,
    previous: null,
  });

  const fetchBooks = async (userId: number, category: string, url?: string) => {
    let requestUrl = url || `${BASE_URL}/readers/books/`;

    if (category === 'loved') {
      requestUrl = `${BASE_URL}/readers/users/${userId}/loved-books/`;
    } else if (category === 'bookmarked') {
      requestUrl = `${BASE_URL}/readers/users/${userId}/bookmarked-books/`;
    } else if (category === 'rated') {
      requestUrl = `${BASE_URL}/readers/users/${userId}/rated-books/`;
    } else if (category === 'commented') {
      requestUrl = `${BASE_URL}/readers/users/${userId}/commented-books/`;
    }

    try {
      const response = await axios.get<PaginatedResponse>(requestUrl);
      const booksWithNames = await Promise.all(response.data.results.map(async (book) => {
        const authorResponse = await axios.get(`${BASE_URL}/authors/${book.author}/`);
        const genreNames = await Promise.all(book.genre.map(async (genreId) => {
          const genreResponse = await axios.get(`${BASE_URL}/genres/${genreId}/`);
          return genreResponse.data.name;
        }));

        return {
          ...book,
          authorName: authorResponse.data.name,
          genreNames: genreNames,
        };
      }));

      setBooks(booksWithNames);
      setPagination({
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error(`Error fetching ${category} books:`, error);
    }
  };

  useEffect(() => {
    fetchBooks(userId, category);
  }, [category]);

  const switchCategory = (newCategory: string) => {
    setCategory(newCategory);
  };

  const loadNextPage = () => {
    if (pagination.next) {
      fetchBooks(userId, category, pagination.next);
    }
  };

  const loadPreviousPage = () => {
    if (pagination.previous) {
      fetchBooks(userId, category, pagination.previous);
    }
  };

  return (
    <div className="reader-mode">

      {/* Filter Menu */}
      <div className="reader-mode__filter-menu">
        <button
          className={`reader-mode__filter-button ${category === 'all' ? 'active' : ''}`}
          onClick={() => switchCategory('all')}
        >
          All Books
        </button>
        <button
          className={`reader-mode__filter-button ${category === 'loved' ? 'active' : ''}`}
          onClick={() => switchCategory('loved')}
        >
          Loved Books
        </button>
        <button
          className={`reader-mode__filter-button ${category === 'bookmarked' ? 'active' : ''}`}
          onClick={() => switchCategory('bookmarked')}
        >
          Bookmarked Books
        </button>
        <button
          className={`reader-mode__filter-button ${category === 'rated' ? 'active' : ''}`}
          onClick={() => switchCategory('rated')}
        >
          Rated Books
        </button>
        <button
          className={`reader-mode__filter-button ${category === 'commented' ? 'active' : ''}`}
          onClick={() => switchCategory('commented')}
        >
          Commented Books
        </button>
      </div>

      {/* Book List */}
      <div className="reader-mode__book-list">
        {books.length > 0 ? (
          books.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id} className="reader-mode__book-item">
              <img src={BASE_URL+book.cover_image_url} alt={book.title} className="reader-mode__book-cover" />
              <div className="reader-mode__book-title">{book.title}</div>
              <div className="reader-mode__book-author">{book.authorName}</div>
              <div className="reader-mode__book-genres">{book.genreNames.join(', ')}</div>
              <div className="reader-mode__book-rating">Rating: {book.rating}</div>
            </Link>
          ))
        ) : (
          <div className="reader-mode__no-books">No books available</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="reader-mode__pagination-controls">
        {pagination.previous && (
          <button className="reader-mode__pagination-button" onClick={loadPreviousPage}>
            Previous
          </button>
        )}
        {pagination.next && (
          <button className="reader-mode__pagination-button" onClick={loadNextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ReaderMode;
