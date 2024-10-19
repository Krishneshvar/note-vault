import { useEffect, useState } from 'react'
import { saveNoteLocally, fetchNotes } from './SQLInit'
import { syncWithServer } from './ServerSync'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [addNote, setAddNote] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [notes, setNotes] = useState([])

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const fetchedNotes = await fetchNotes()
        setNotes(fetchedNotes)
      } catch (error) {
        console.error('Error loading notes:', error)
      }
    }

    loadNotes()
  }, [])

  function addNoteDisplay() {
    setAddNote(!addNote)
  }

  const handleAddNote = async () => {
    const trimmedTitle = title.trim()
    const trimmedDescription = description.trim()

    if (trimmedTitle && trimmedDescription) {
      try {
        await saveNoteLocally(trimmedTitle, trimmedDescription)
        setTitle('')
        setDescription('')
        setAddNote(false)
        setError('')

        const fetchedNotes = await fetchNotes()
        setNotes(fetchedNotes)
      } catch (err) {
        console.error('Error saving note:', err)
        setError('Failed to save note. Please try again.')
      }
    } else {
      setError('Please enter both title and description.')
    }
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-5">
      <div className="container">
        <div className="card shadow">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="card-title h3">Notes</h1>
              <div>
                <button
                  onClick={addNoteDisplay}
                  className="btn btn-primary me-2"
                >
                  {addNote ? 'Cancel' : 'Add Note'}
                </button>
                <button
                  onClick={syncWithServer}
                  className="btn btn-success"
                >
                  Sync
                </button>
              </div>
            </div>

            {error && <p className="text-danger mb-3">{error}</p>}

            {addNote && (
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-control mb-2"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control mb-2"
                  rows="3"
                  required
                />
                <button
                  onClick={handleAddNote}
                  className="btn btn-primary w-100"
                >
                  Add Note
                </button>
              </div>
            )}

            <ul className="list-unstyled">
              {notes.map((note) => (
                <li key={note.note_id} className="card mb-3">
                  <div className="card-body">
                    <h3 className="card-title h5">{note.title}</h3>
                    <p className="card-text text-muted">{note.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}