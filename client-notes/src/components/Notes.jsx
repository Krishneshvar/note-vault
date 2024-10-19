import { useEffect, useState } from 'react';
import '../assets/Notes.css';
import { fetchNotes, deleteNoteLocally } from '../SQLInit'; // Import your functions

function Notes() {
    const [notes, setNotes] = useState([]);

    // Fetch notes from local SQLite database
    useEffect(() => {
        const loadNotes = async () => {
            try {
                const fetchedNotes = await fetchNotes(); // Fetch notes from local DB
                setNotes(fetchedNotes);
            } catch (error) {
                console.error('Error fetching notes:', error);
            }
        };

        loadNotes();
    }, []);

    const handleEdit = (noteId) => {
        // Implement edit functionality
        console.log(`Edit note with ID: ${noteId}`);
        // You can navigate to an edit page or open a modal here
    };

    const handleDelete = async (noteId) => {
        try {
            await deleteNoteLocally(noteId); // Delete from local DB
            setNotes(notes.filter(note => note.note_id !== noteId)); // Update state to remove deleted note
            console.log(`Deleted note with ID: ${noteId}`);
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    return (
        <div className="notes-container">
            <h2>Your Notes</h2>
            {notes.length === 0 ? (
                <p>No notes available.</p>
            ) : (
                <ul>
                    {notes.map(note => (
                        <li key={note.note_id}>
                            <h3>{note.title}</h3>
                            <p>{note.description}</p> {/* Changed 'desc' to 'description' */}
                            <div className="button-group">
                                <button onClick={() => handleEdit(note.note_id)}>Edit</button>
                                <button onClick={() => handleDelete(note.note_id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Notes;
