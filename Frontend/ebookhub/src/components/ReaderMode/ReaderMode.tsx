import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ReaderMode.css';
import { fetchData } from '../../services/apiService';  // Import the fetchData function

const BASE_URL = process.env.REACT_APP_API_URL;

interface Book {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
    bio: string;
  };
  description: string;
  genre: Array<{
    id: number;
    name: string;
  }>;
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
    let requestUrl = url || `/readers/books/`;

    if (category === 'loved') {
      requestUrl = `/readers/users/${userId}/loved-books/`;
    } else if (category === 'bookmarked') {
      requestUrl = `/readers/users/${userId}/bookmarked-books/`;
    } else if (category === 'rated') {
      requestUrl = `/readers/users/${userId}/rated-books/`;
    } else if (category === 'commented') {
      requestUrl = `/readers/users/${userId}/commented-books/`;
    }

    try {
      const response = await fetchData(requestUrl, 'GET');  // Using the fetchData helper function

      const booksWithNames = response.results.map((book: Book) => {
        const authorName = book.author.name;  // Directly using author name from response
        const genreNames = book.genre.map((genre) => genre.name);  // Extract genre names

        return {
          ...book,
          authorName,
          genreNames,
        };
      });

      setBooks(booksWithNames);
      setPagination({
        next: response.next,
        previous: response.previous,
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
              <img src={BASE_URL + book.cover_image_url} alt={book.title} className="reader-mode__book-cover" />
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
