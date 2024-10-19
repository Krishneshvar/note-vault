const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('notes.db');

// Create a table for storing notes if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS notes (
  note_id INTEGER PRIMARY KEY AUTOINCREMENT,
  create_time TEXT NOT NULL,
  title TEXT NOT NULL,
  desc TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active'
)`);

// Insert a note
function saveNoteLocally(title, desc, status = 'active') {
  const createdAt = new Date().toISOString();
  db.run(`INSERT INTO notes (create_time, title, "desc", status) VALUES (?, ?, ?, ?)`, 
    [createdAt, title, desc, status], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Note saved with ID ${this.lastID}`);
    });
}

// Example usage
saveNoteLocally("My First Note", "This is the description of my first note.");