import React, { useState } from 'react';
import axios from 'axios';

const BookUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);  // State for cover image
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
    setCover(file);  // Handle cover image
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

    if (!file) {
      setMessage('Please select an EPUB file to upload.');
      setMessageType('error');
      return;
    }

    if (!title || !author || !genre || !description) {
      setMessage('All book details are required.');
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

    
    if (cover) {
      formData.append('cover_image', cover);
    }

    // Add user_id from localStorage
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
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
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
    <div className="book-upload">
      <h2>Upload a Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Book Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={handleInputChange}
            placeholder="Enter book title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            id="author"
            name="author"
            value={author}
            onChange={handleInputChange}
            placeholder="Enter author name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <input
            type="text"
            id="genre"
            name="genre"
            value={genre}
            onChange={handleInputChange}
            placeholder="Enter genre"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={handleInputChange}
            placeholder="Enter book description"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="file">Upload EPUB File</label>
          <input
            type="file"
            id="file"
            accept=".epub"
            onChange={handleFileChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cover">Upload Book Cover (Optional)</label>
          <input
            type="file"
            id="cover"
            accept="image/*"
            onChange={handleCoverChange}  // Handle cover change
          />
        </div>

        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload Book'}
        </button>
      </form>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BookUpload;
