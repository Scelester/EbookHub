import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchData } from '../../services/apiService'; // Import your fetchData helper

const BASE_URL = process.env.REACT_APP_API_URL;

interface Chapter {
  id: number;
  chapter_title: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Author {
  id: number;
  name: string;
  bio: string;
}

interface Book {
  id: number;
  title: string;
  author: Author;  // Adjusted to match the object structure
  genreNames: string[];
  cover_image_url: string;
  date_published: string;
  rating: string | null;  // Rating might be null
  user_rating: number;    // User rating
  is_loved: boolean;
  is_bookmarked: boolean;
  can_fork: boolean;
  chapters: Chapter[];
  comments: any[];  // Adjusted type of comments
}

interface Comment {
  user__username: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const BookDetails: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoved, setIsLoved] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);  // State for chapters
  const [loading, setLoading] = useState(false);  // Loading state for chapters
  const [currentPage, setCurrentPage] = useState(1);  // Current page of chapters to fetch
  const chaptersContainerRef = useRef<HTMLDivElement | null>(null);  // Ref for scroll container

  const userId = 6;
  const ITEMS_PER_PAGE = 10;  // Number of chapters to load per request

  useEffect(() => {
    if (bookId) {
      // Fetch book details only (no interactions yet)
      fetchData(`/books/${bookId}/`, 'GET')
        .then((response) => {
          console.log(response)
          setBook(response);
          setChapters(response.chapters.slice(0, ITEMS_PER_PAGE)); // Initialize with first page of chapters
          setIsLoved(response.is_loved);
          setIsBookmarked(response.is_bookmarked);
          setUserRating(response.user_rating || 0);
          setComments(response.comments || []);
        })
        .catch(error => console.error("Error fetching book details:", error));
    }
  }, [bookId]);

  const fetchMoreChapters = () => {
    if (loading) return;  // Prevent multiple loads at once
    setLoading(true);

    const nextChapters = book?.chapters.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );
    if (nextChapters) {
      setChapters((prevChapters) => [...prevChapters, ...nextChapters]);
      setCurrentPage(currentPage + 1);
    }
    setLoading(false);
  };

  const handleScroll = () => {
    const container = chaptersContainerRef.current;
    if (container) {
      const bottom = container.scrollHeight === container.scrollTop + container.clientHeight;
      if (bottom) {
        fetchMoreChapters();
      }
    }
  };

  const toggleLove = () => {
    const url = `/readers/books/${bookId}/loves/`;
    const method = isLoved ? 'DELETE' : 'POST';
    fetchData(url, method, { user_id: userId, book_id: bookId })
      .then(() => setIsLoved(!isLoved))
      .catch(error => console.error("Error toggling love:", error));
  };

  const toggleBookmark = () => {
    const url = `/readers/books/${bookId}/bookmarks/`;
    const method = isBookmarked ? 'DELETE' : 'POST';
    fetchData(url, method, { user_id: userId, book_id: bookId })
      .then((r) => {setIsBookmarked(!isBookmarked);console.log(r)})
      .catch(error => console.error("Error toggling bookmark:", error));
  };

  const submitRating = () => {
    fetchData(`/readers/books/${bookId}/ratings/`, 'POST', { user_id: userId, book_id: bookId, rating: userRating })
      .then(response => setUserRating(response.rating))
      .catch(error => console.error("Error submitting rating:", error));
  };

  const submitComment = () => {
    fetchData(`/readers/books/${bookId}/comments/`, 'POST', { user_id: userId, book_id: bookId, content: comment })
      .then(response => {
        const newComment = response;
        if (newComment && newComment.content) {
          setComments([...comments, newComment]);
          setComment('');
        } else {
          console.error('Unexpected response format for new comment:', response);
        }
      })
      .catch(error => console.error("Error submitting comment:", error));
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-details">
      <img src={book.cover_image_url} alt={book.title} className="book-cover" width={500} />
      <h1>{book.title}</h1>
      <p>Author: {book.author.name}</p>  {/* Displaying author name */}
      <p>Genres: {book.genreNames.join(', ')}</p>
      <p>Published on: {book.date_published}</p>
      <p>Rating: {book.rating || "Not Rated"}</p> {/* Fallback if no rating */}

      {/* Chapter Titles with Infinite Scroll */}
      <div
        className="chapters"
        ref={chaptersContainerRef}
        onScroll={handleScroll}
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        <h3>Chapters</h3>
        <ul>
          {chapters.map((chapter) => (
            <li key={chapter.id}>{chapter.chapter_title}</li>
          ))}
        </ul>
        {loading && <p>Loading more chapters...</p>}
      </div>

      {/* Love & Bookmark */}
      <button onClick={() => { toggleLove(); }}>
        {isLoved ? 'Unlove' : 'Love'}
      </button>
      <button onClick={() => { toggleBookmark(); }}>
        {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
      </button>

      {/* Rating */}
      <div className="rating">
        <h3>Rate this book</h3>
        <input
          type="number"
          value={userRating}
          onChange={(e) => setUserRating(Number(e.target.value))}
          min="1"
          max="5"
        />
        <button onClick={submitRating}>Submit Rating</button>
      </div>

      {/* Comments */}
      <div className="comments">
        <h3>Comments</h3>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <strong>{comment.user__username}</strong>: {comment.content}
            </li>
          ))}
        </ul>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={submitComment}>Submit Comment</button>
      </div>
    </div>
  );
};

export default BookDetails;
