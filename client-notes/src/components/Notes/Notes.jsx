import { useEffect, useState } from 'react'
import { fetchNotes, deleteNoteLocally } from '../../SQLInit'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Notes.css'

export default function Notes() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fetchedNotes = await fetchNotes()
        setNotes(fetchedNotes)
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }

    loadNotes()
  }, [])

  const handleEdit = (noteId) => {
    console.log(`Edit note with ID: ${noteId}`)
    // Implement edit functionality here
  }

  const handleDelete = async (noteId) => {
    try {
      await deleteNoteLocally(noteId)
      setNotes(notes.filter((note) => note.note_id !== noteId))
      console.log(`Deleted note with ID: ${noteId}`)
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  return (
    <div className="notes-page">
      <div className="notes-container">
        <h2 className="notes-title">Your Notes</h2>
        {notes.length === 0 ? (
          <p className="notes-empty">No notes available.</p>
        ) : (
          <ul className="notes-list">
            {notes.map((note) => (
              <li key={note.note_id} className="note-item">
                <h3 className="note-title">{note.title}</h3>
                <p className="note-description">{note.description}</p>
                <div className="note-actions">
                  <button onClick={() => handleEdit(note.note_id)} className="btn btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note.note_id)} className="btn btn-delete">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
