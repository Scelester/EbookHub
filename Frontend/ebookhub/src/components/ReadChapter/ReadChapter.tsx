import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchData } from '../../services/apiService'; // Your API helper

interface Chapter {
  id: number;
  chapter_title: string;
  content: string;
}

const ReadChapter: React.FC = () => {
  const { book_id, chapter_id } = useParams<{ book_id: string; chapter_id: string }>();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (book_id && chapter_id) {
      // Fetch the current chapter and all chapters in the book
      fetchData(`/readers/books/${book_id}/c/${chapter_id}/`, 'GET')
        .then((response) => {
          setChapter(response.chapter);
          setChapters(response.all_chapters);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching chapter:", err);
          setError("Failed to load chapter.");
          setLoading(false);
        });
    }
  }, [book_id, chapter_id]);

  const goToChapter = (chapterId: number) => {
    navigate(`/books/${book_id}/c/${chapterId}`);
  };

  const getNextChapterId = () => {
    const currentIndex = chapters.findIndex((ch) => ch.id === parseInt(chapter_id || '0', 10));
    return currentIndex !== -1 && currentIndex + 1 < chapters.length ? chapters[currentIndex + 1].id : null;
  };

  const getPreviousChapterId = () => {
    const currentIndex = chapters.findIndex((ch) => ch.id === parseInt(chapter_id || '0', 10));
    return currentIndex > 0 ? chapters[currentIndex - 1].id : null;
  };

  const NavigationControls: React.FC = () => (
    <div className="navigation-buttons">
      <button
        disabled={!getPreviousChapterId()}
        onClick={() => goToChapter(getPreviousChapterId()!)}
      >
        Previous Chapter
      </button>

      <select
        value={chapter_id}
        onChange={(e) => goToChapter(parseInt(e.target.value, 10))}
      >
        {chapters.map((ch) => (
          <option key={ch.id} value={ch.id}>
            {ch.chapter_title}
          </option>
        ))}
      </select>

      <button
        disabled={!getNextChapterId()}
        onClick={() => goToChapter(getNextChapterId()!)}
      >
        Next Chapter
      </button>
    </div>
  );

  if (loading) return <p>Loading chapter...</p>;
  if (error) return <p>{error}</p>;
  if (!chapter) return <p>No chapter found.</p>;

  return (
    <div className="read-chapter">
      <h1>{chapter.chapter_title}</h1>

      {/* Top Navigation */}
      <NavigationControls />

      {/* Chapter Content */}
      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{chapter.content}</pre>

      {/* Bottom Navigation */}
      <NavigationControls />
    </div>
  );
};

export default ReadChapter;
