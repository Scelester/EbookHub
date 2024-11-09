import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

interface Book {
  id: number;
  title: string;
  author: number;  // Author ID
  publisher: number;  // Publisher ID
  description: string;
  genre: number[];  // Array of genre IDs
  cover_image_url: string;
  date_published: string;
  can_fork: boolean;
  rating: string;
  chapters: Array<{
    id: number;
    chapter_title: string;
    content: string;
  }>;
}

// New type to include authorName, publisherName, and genreNames
interface BookWithNames extends Book {
  authorName: string;
  publisherName: string;
  genreNames: string[];  // Array of genre names
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

const ReaderMode: React.FC = () => {
  const [books, setBooks] = useState<BookWithNames[]>([]); // Updated to use BookWithNames
  const [category, setCategory] = useState<string>('all');  // Default category
  const [userId, setUserId] = useState<number>(6);  // Assume user ID is 6 for this example
  const [pagination, setPagination] = useState<{
    next: string | null;
    previous: string | null;
  }>({
    next: null,
    previous: null,
  });

  // Function to fetch books based on selected category and pagination state
  const fetchBooks = async (userId: number, category: string, url?: string) => {
    let requestUrl = url || `${BASE_URL}/readers/books/`;  // Default to all books

    // Depending on the category, change the endpoint to filter books
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

      // Fetch author, publisher, and genres for each book
      const booksWithNames = await Promise.all(response.data.results.map(async (book) => {
        const authorResponse = await axios.get(`${BASE_URL}/authors/${book.author}/`);
        const publisherResponse = await axios.get(`${BASE_URL}/publishers/${book.publisher}/`);

        // Fetch genre names
        const genreNames = await Promise.all(book.genre.map(async (genreId) => {
          const genreResponse = await axios.get(`${BASE_URL}/genres/${genreId}/`);
          return genreResponse.data.name;
        }));

        // Merge the author, publisher, and genre names into the book object
        return {
          ...book,
          authorName: authorResponse.data.name,
          publisherName: publisherResponse.data.username,
          genreNames: genreNames, // Set the genre names
        };
      }));

      setBooks(booksWithNames);  // Set the books data with author/publisher/genre names
      setPagination({
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (error) {
      console.error(`Error fetching ${category} books:`, error);
    }
  };

  // Load the books whenever the category changes
  useEffect(() => {
    fetchBooks(userId, category);  // Load books for the initial category
  }, [category]);  // Re-fetch when category changes

  // Function to handle category changes
  const switchCategory = (newCategory: string) => {
    setCategory(newCategory);  // Set the category and fetch corresponding books
  };

  // Function to load next page of books
  const loadNextPage = () => {
    if (pagination.next) {
      fetchBooks(userId, category, pagination.next);  // Fetch books for the next page
    }
  };

  // Function to load previous page of books
  const loadPreviousPage = () => {
    if (pagination.previous) {
      fetchBooks(userId, category, pagination.previous);  // Fetch books for the previous page
    }
  };

  return (
    <div className="reader-mode">
      <h1 className="reader-mode__title">Reader Mode</h1>

      {/* Filter Menu */}
      <div className="reader-mode__filter-menu">
        <button className="reader-mode__filter-button" onClick={() => switchCategory('all')}>All Books</button>
        <button className="reader-mode__filter-button" onClick={() => switchCategory('loved')}>Loved Books</button>
        <button className="reader-mode__filter-button" onClick={() => switchCategory('bookmarked')}>Bookmarked Books</button>
        <button className="reader-mode__filter-button" onClick={() => switchCategory('rated')}>Rated Books</button>
        <button className="reader-mode__filter-button" onClick={() => switchCategory('commented')}>Commented Books</button>
      </div>

      {/* Display Book List */}
      <div className="reader-mode__book-list">
        <h2 className="reader-mode__category-title">{category.charAt(0).toUpperCase() + category.slice(1)} Books</h2>
        {books.length > 0 ? (
          books.map((book) => (
            <div className="reader-mode__book-item" key={book.id}>
              <h3 className="reader-mode__book-title">{book.title}</h3>
              <p className="reader-mode__book-author">by {book.authorName}</p>
              <p className="reader-mode__book-publisher">Publisher: {book.publisherName}</p>
              <p className="reader-mode__book-genres">Genres: {book.genreNames.join(', ')}</p>
              <p className="reader-mode__book-description">Description: {book.description}</p>
              <p className="reader-mode__book-rating">Rating: {book.rating}</p>
              <img className="reader-mode__book-cover" src={BASE_URL + book.cover_image_url} alt={book.title} width={100} />
              <p className="reader-mode__book-date-published">Published on: {book.date_published}</p>
            </div>
          ))
        ) : (
          <p className="reader-mode__no-books">No books to display</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="reader-mode__pagination-controls">
        {pagination.previous && <button className="reader-mode__pagination-button" onClick={loadPreviousPage}>Previous</button>}
        {pagination.next && <button className="reader-mode__pagination-button" onClick={loadNextPage}>Next</button>}
      </div>
    </div>
  );
};

export default ReaderMode;
