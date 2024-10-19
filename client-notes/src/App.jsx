import { useEffect, useState } from 'react';
import './assets/App.css';
import { saveNoteLocally, fetchNotes } from './SQLInit'; // Importing functions from SQLInit
import { syncWithServer } from './ServerSync';

function App() {
  const [addNote, setAddNote] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fetchedNotes = await fetchNotes(); // Fetching notes from local DB
        setNotes(fetchedNotes);
      } catch (error) {
        console.error('Error loading notes:', error); // Error handling
      }
    };

    loadNotes();
  }, []);

  function addNoteDisplay() {
    setAddNote(!addNote);
  }

  const handleAddNote = async () => {
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle && trimmedDescription) {
      try {
        await saveNoteLocally(trimmedTitle, trimmedDescription); // Save note locally
        setTitle('');
        setDescription('');
        setAddNote(false);
        setError(''); // Clear any previous errors

        // Fetch updated notes after adding a new one
        const fetchedNotes = await fetchNotes(); // Ensure we have the latest notes
        setNotes(fetchedNotes);
      } catch (err) {
        console.error('Error saving note:', err);
        setError('Failed to save note. Please try again.');
      }
    } else {
      setError('Please enter both title and description.');
    }
  };

  return (
    <>
      <div className="notes-container">
        <h1>Notes</h1>
        <button onClick={addNoteDisplay}>+</button>
        <button onClick={syncWithServer}>Sync</button>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        {addNote ? (
          <div>
            <input 
              type="text" 
              placeholder='Title' 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required
            />
            <input 
              type="text" 
              placeholder='Description' 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required
            />
            <button onClick={handleAddNote}>Add</button>
          </div>
        ) : null}

        {/* Displaying all notes */}
        <ul>
          {notes.map(note => (
            <li key={note.note_id}>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;
