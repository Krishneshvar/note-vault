import express from 'express'
import dotenv from 'dotenv'
import notesDB from './db/notesDB.js';

dotenv.config();
const app = express();

notesDB.connect((err) => {
    if (err) {
      console.error('Database connection error:', err.stack);
    }
    else {
      console.log('Connected to database.');
    }
});

app.post('/sync-notes', async (req, res) => {
    const notes = req.body.notes;

    // Validate input
    if (!Array.isArray(notes) || notes.length === 0) {
        return res.status(400).send('No notes provided.');
    }

    // Insert each note into PostgreSQL
    try {
        const query = 'INSERT INTO notes (note_id, create_time, title, "desc", status) VALUES ($1, $2, $3, $4, $5)';
        for (const note of notes) {
            await pool.query(query, [note.note_id, note.create_time, note.title, note.desc, note.status]);
        }
        res.status(200).send('Notes synchronized successfully.');
    } catch (err) {
        console.error('Error syncing notes:', err); // Log error details for debugging
        res.status(500).send('Error syncing notes');
    }
});

app.listen(process.env.NODE_PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.NODE_PORT}`);
});
  