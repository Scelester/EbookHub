import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../services/apiService';
import './WriteBook.css';

const CreateBookPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        description: '',
        genre: '',
        datePublished: '',
        canFork: false,
    });
    const [titles, setTitles] = useState<string[]>([]);   // State for book titles
    const [authors, setAuthors] = useState<string[]>([]);  // State for authors
    const [genres, setGenres] = useState<string[]>([]);    // State for genres
    const [error, setError] = useState<string | null>(null);
    const [genreList, setGenreList] = useState<string[]>([]); // Holds the genres entered
    const [filteredGenres, setFilteredGenres] = useState<string[]>([]); // Holds filtered genre suggestions based on input
    const ignore = useRef(0);

    // Fetch titles, authors, and genres on component mount
    useEffect(() => {
        const fetchTitlesAuthorsAndGenres = async () => {
            try {
                const titlesResponse = await fetchData('/api/generic_queries/?type=books', 'GET');
                setTitles(titlesResponse);

                const authorsResponse = await fetchData('/api/generic_queries/?type=authors', 'GET');
                setAuthors(authorsResponse);

                const genresResponse = await fetchData('/api/generic_queries/?type=genres', 'GET');
                setGenres(genresResponse);
            } catch (err: any) {
                console.error('Error fetching data:', err);
                setError('Failed to fetch titles, authors, or genres.');
            }
        };

        fetchTitlesAuthorsAndGenres();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        // Filter genres based on the input
        const filtered = genres.filter(genre => genre.toLowerCase().includes(value.toLowerCase()));
        setFilteredGenres(filtered);

        // Update genre input field
        setFormData(prev => ({
            ...prev,
            genre: value,
        }));
    };

    const handleGenreInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const inputValue = e.currentTarget.value;

        // Check if the input contains a comma to signify a genre entry
        if (inputValue.includes(',')) {
            const newGenres = inputValue.split(',').map((genre) => genre.trim()).filter(Boolean);
            setGenreList(prev => [...prev, ...newGenres]);

            // Clear the input field after adding genres
            setFormData(prev => ({
                ...prev,
                genre: '',
            }));
        } else if (e.key === 'Backspace' && inputValue === '') {
            // Handle deleting the last genre when backspace is pressed and input is empty
            if (ignore.current === 1) {
                setGenreList(prev => prev.slice(0, -1));
                ignore.current = 0;
            }
            ignore.current = 1;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetchData('/books/', 'POST', formData);
            console.log('Book Created:', response);
            navigate(`/write-book/${response.id}/chapters`);
        } catch (err: any) {
            console.error('Error creating book:', err);
            setError(err.message || 'Failed to create the book.');
        }
    };

    // Function to display genres inside the input field as tags
    const displayGenresInInput = () => {
        return genreList.map((genre, index) => (
            <span key={index} className="genre-tag">
                {genre}
            </span>
        ));
    };

    return (
        <div className="create-book-container">
            <h1>Create</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="input-group">
                    <label>Title:</label>
                    <input
                        list="titles"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Start typing the title"
                        required
                    />
                    <datalist id="titles">
                        {titles.map((title, index) => (
                            <option key={index} value={title} />
                        ))}
                    </datalist>
                </div>

                <div className="input-group">
                    <label>Author:</label>
                    <input
                        list="authors"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="Start typing the author"
                        required
                    />
                    <datalist id="authors">
                        {authors.map((author, index) => (
                            <option key={index} value={author} />
                        ))}
                    </datalist>
                </div>

                <div className="input-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Write a brief description of the book"
                    />
                </div>

                <div className="input-group">
                    <label>Genre:</label>
                    <div className="genre-input-container">
                        <div className="genre-tags-container">
                            {displayGenresInInput()}
                        </div>
                        <input
                            type="text"
                            name="genre"
                            value={formData.genre}
                            onChange={handleGenreChange}
                            onKeyUp={handleGenreInput}
                            placeholder="Enter genres, separated by commas"
                            list="genre-suggestions"
                        />
                    </div>
                    {/* Dynamically updated datalist with filtered genres */}
                    <datalist id="genre-suggestions">
                        {filteredGenres.slice(0, 5).map((genre, index) => (
                            <option key={index} value={genre} />
                        ))}
                    </datalist>
                    <p className="helper-text">Genres should be separated by commas. E.g., Fiction, Fantasy, Drama</p>
                </div>

                <div className="input-group checkbox-group">
                    <label>Can Fork:</label>
                    <input
                        type="checkbox"
                        name="canFork"
                        checked={formData.canFork}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="submit-btn">Create Book</button>
            </form>

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default CreateBookPage;
