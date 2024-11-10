import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_API_URL;

interface Chapter {
  id: number;
  chapter_title: string;
}

interface Book {
  id: number;
  title: string;
  authorName: string;
  genreNames: string[];
  cover_image_url: string;
  date_published: string;
  rating: string;
  chapters: Chapter[];
  can_fork: boolean;
}

interface Comment {
  user: string;
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

  const userId = 6;

  useEffect(() => {
    if (bookId) {
      // Fetch book details
      axios.get(`${BASE_URL}/books/${bookId}/`)
        .then(response => setBook(response.data))
        .catch(error => console.error("Error fetching book details:", error));

      // Fetch initial interactions
      axios.get(`${BASE_URL}/readers/books/${bookId}/loves/`, { params: { user_id: userId, book_id: bookId } })
        .then(response => setIsLoved(response.data.is_loved))
        .catch(error => console.error("Error fetching love status:", error));

      axios.get(`${BASE_URL}/readers/books/${bookId}/bookmarks/`, { params: { user_id: userId, book_id: bookId } })
        .then(response => setIsBookmarked(response.data.is_bookmarked))
        .catch(error => console.error("Error fetching bookmark status:", error));

      axios.get(`${BASE_URL}/readers/books/${bookId}/ratings/`, { params: { user_id: userId, book_id: bookId } })
        .then(response => setUserRating(response.data.rating || 0))
        .catch(error => console.error("Error fetching rating:", error));

      axios.get(`${BASE_URL}/readers/books/${bookId}/comments/`, { params: { user_id: userId, book_id: bookId } })
        .then(response => {
          // Assuming response contains an array of comments
          if (Array.isArray(response.data)) {
            setComments(response.data);
          } else {
            console.error('Unexpected response format for comments:', response.data);
          }
        })
        .catch(error => console.error("Error fetching comments:", error));
    }
  }, [bookId]);

  const toggleLove = () => {
    const url = `${BASE_URL}/readers/books/${bookId}/loves/`;
    const method = isLoved ? 'delete' : 'post';
    axios({ method, url, data: { user_id: userId, book_id: bookId } })
      .then(() => setIsLoved(!isLoved))
      .catch(error => console.error("Error toggling love:", error));
  };

  const toggleBookmark = () => {
    const url = `${BASE_URL}/readers/books/${bookId}/bookmarks/`;
    const method = isBookmarked ? 'delete' : 'post';
    axios({ method, url, data: { user_id: userId, book_id: bookId } })
      .then(() => setIsBookmarked(!isBookmarked))
      .catch(error => console.error("Error toggling bookmark:", error));
  };

  const submitRating = () => {
    axios.post(`${BASE_URL}/readers/books/${bookId}/ratings/`, { user_id: userId, book_id: bookId, rating: userRating })
      .then(response => setUserRating(response.data.rating))
      .catch(error => console.error("Error submitting rating:", error));
  };

  const submitComment = () => {
    axios.post(`${BASE_URL}/readers/books/${bookId}/comments/`, { user_id: userId, book_id: bookId, content: comment })
      .then(response => {
        // Assuming response contains a single comment object
        const newComment = response.data;
        if (newComment && newComment.content) {
          setComments([...comments, newComment]);  // Add the new comment to state
          setComment('');  // Clear the input field after submission
        } else {
          console.error('Unexpected response format for new comment:', response.data);
        }
      })
      .catch(error => console.error("Error submitting comment:", error));
  };

  if (!book) return <p>Loading...</p>;

  return (
    <div className="book-details">
      <img src={book.cover_image_url} alt={book.title} className="book-cover" />
      <h1>{book.title}</h1>
      <p>Author: {book.authorName}</p>
      <p>Genres: {book.genreNames.join(', ')}</p>
      <p>Published on: {book.date_published}</p>
      <p>Rating: {book.rating}</p>

      {/* Chapter Titles */}
      <div className="chapters">
        <h3>Chapters</h3>
        <ul>
          {book.chapters.map((chapter) => (
            <li key={chapter.id}>{chapter.chapter_title}</li>
          ))}
        </ul>
      </div>

      {/* Love & Bookmark */}
      <button onClick={toggleLove}>{isLoved ? 'Unlove' : 'Love'}</button>
      <button onClick={toggleBookmark}>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</button>

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
              <strong>{comment.user}</strong>: {comment.content}
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
