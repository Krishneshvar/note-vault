import initSqlJs from 'sql.js';

let db; // Database instance

async function initializeDatabase() {
    const SQL = await initSqlJs(); // Load sql.js
    db = new SQL.Database(); // Create a new database

    // Create the notes table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS notes (
        note_id INTEGER PRIMARY KEY AUTOINCREMENT,
        create_time TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'active'
    )`);

    console.log('Database initialized and notes table created.');
}

async function getDb() {
    if (!db) {
        await initializeDatabase();
    }
    return db;
}

function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Insert a note
async function saveNoteLocally(title, description, status = 'active') {
    const createdAt = getCurrentDateTime();
    
    const db = await getDb(); // Ensure we have the initialized db
    db.run(`INSERT INTO notes (create_time, title, description, status) VALUES (?, ?, ?, ?)`, 
        [createdAt, title, description, status]);
    
    console.log(`Note saved with title: ${title}`);
}

// Fetch all notes
async function fetchNotes() {
    const db = await getDb(); // Ensure we have the initialized db
    const res = db.exec(`SELECT * FROM notes`);
    
    if (res.length > 0) {
        return res[0].values.map(row => ({
            note_id: row[0],
            create_time: row[1],
            title: row[2],
            description: row[3],
            status: row[4]
        }));
    }
    
    return [];
}

// Delete a note
async function deleteNoteLocally(noteId) {
    const db = await getDb(); // Ensure we have the initialized db
    db.run(`DELETE FROM notes WHERE note_id = ?`, [noteId]);
    console.log(`Deleted note with ID ${noteId}`);
}

// Update a note
async function updateNoteLocally(noteId, title, description, status) {
    const db = await getDb(); // Ensure we have the initialized db
    db.run(`UPDATE notes SET title = ?, description = ?, status = ? WHERE note_id = ?`, 
        [title, description, status, noteId]);
    
    console.log(`Updated note with ID ${noteId}`);
}

// Initialize the database when the module is loaded
initializeDatabase();

export { getDb, saveNoteLocally, fetchNotes, deleteNoteLocally, updateNoteLocally };
