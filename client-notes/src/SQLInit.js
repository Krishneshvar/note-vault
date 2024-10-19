import Dexie from 'dexie';

// Create a new database instance
const db = new Dexie('MyDatabase');

// Define the database schema
db.version(1).stores({
    notes: '++note_id, create_time, title, description, status' // Primary key and indexed fields
});

// Function to get the current date and time
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
    
    await db.notes.add({
        create_time: createdAt,
        title,
        description,
        status
    });
    
    console.log(`Note saved with title: ${title}`);
}

// Fetch all notes
async function fetchNotes() {
    return await db.notes.toArray(); // Fetch all notes as an array
}

// Delete a note
async function deleteNoteLocally(noteId) {
    await db.notes.delete(noteId); // Delete note by ID
    console.log(`Deleted note with ID ${noteId}`);
}

// Update a note
async function updateNoteLocally(noteId, title, description, status) {
    await db.notes.update(noteId, { title, description, status });
    console.log(`Updated note with ID ${noteId}`);
}

// Initialize the database (optional in Dexie)
async function initializeDatabase() {
    // You can perform any setup here if needed
}

initializeDatabase();

export { saveNoteLocally, fetchNotes, deleteNoteLocally, updateNoteLocally };
