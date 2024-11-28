import React, { useState } from 'react';
import axios from 'axios';
import './UploadBook.css';

const BookUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setFile(file);
  };

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setCover(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'title') setTitle(value);
    if (name === 'author') setAuthor(value);
    if (name === 'genre') setGenre(value);
    if (name === 'description') setDescription(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!file || !title || !author || !genre || !description) {
      setMessage('All fields are required except for the cover image.');
      setMessageType('error');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genre', genre);
    formData.append('description', description);

    if (cover) formData.append('cover_image', cover);

    const userId = localStorage.getItem('user_id');
    if (userId) {
      formData.append('user_id', userId);
    } else {
      setMessage('User not logged in.');
      setMessageType('error');
      setIsUploading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/writers/upload-epub/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(`Book "${response.data.detail}" uploaded successfully.`);
      setMessageType('success');
    } catch (error) {
      console.error(error);
      setMessage('Failed to upload the book. Please try again.');
      setMessageType('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-book-container" id="upload-book-container">
      <h2 className="upload-book-header" id="upload-book-header">Upload a Book</h2>
      <form className="upload-book-form" id="upload-book-form" onSubmit={handleSubmit}>
        <div className="form-group" id="form-group-title">
          <label className="form-label" htmlFor="book-title">Book Title</label>
          <input
            type="text"
            id="book-title"
            className="form-input"
            name="title"
            value={title}
            onChange={handleInputChange}
            placeholder="Enter book title"
            required
          />
        </div>

        <div className="form-group" id="form-group-author">
          <label className="form-label" htmlFor="book-author">Author</label>
          <input
            type="text"
            id="book-author"
            className="form-input"
            name="author"
            value={author}
            onChange={handleInputChange}
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="form-group" id="form-group-genre">
          <label className="form-label" htmlFor="book-genre">Genre</label>
          <input
            type="text"
            id="book-genre"
            className="form-input"
            name="genre"
            value={genre}
            onChange={handleInputChange}
            placeholder="Enter genre"
            required
          />
        </div>

        <div className="form-group" id="form-group-description">
          <label className="form-label" htmlFor="book-description">Description</label>
          <textarea
            id="book-description"
            className="form-textarea"
            name="description"
            value={description}
            onChange={handleInputChange}
            placeholder="Enter book description"
            required
          ></textarea>
        </div>

        <div className="form-group" id="form-group-file">
          <label className="form-label" htmlFor="book-file">Upload EPUB File</label>
          <input
            type="file"
            id="book-file"
            className="form-input"
            accept=".epub"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group" id="form-group-cover">
          <label className="form-label" htmlFor="book-cover">Upload Book Cover (Optional)</label>
          <input
            type="file"
            id="book-cover"
            className="form-input"
            accept="image/*"
            onChange={handleCoverChange}
          />
        </div>

        <button
          type="submit"
          id="upload-book-button"
          className={`upload-button ${isUploading ? 'uploading' : ''}`}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>

      {message && (
        <div
          className={`upload-message ${messageType}`}
          id={`upload-message-${messageType}`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default BookUpload;
