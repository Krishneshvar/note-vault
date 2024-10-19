import { fetchNotes, deleteNoteLocally } from './SQLInit'; // Ensure deleteNoteLocally is imported

async function syncWithServer() {
    if (navigator.onLine) {
        try {
            const notes = await fetchNotes(); // Fetch notes using updated fetchNotes
            
            // Check if there are notes to sync
            if (notes.length === 0) {
                console.log('No notes to sync.');
                return;
            }

            // Send notes to the server for synchronization
            const response = await fetch('http://localhost:3000/sync-notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notes }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Sync successful:', data);

            // Optionally, delete notes from local storage after successful sync
            for (const note of notes) {
                await deleteNoteLocally(note.note_id); // Assuming you have this function in SQLInit.js
            }
            console.log('Successfully deleted synced notes from local storage.');
        } catch (error) {
            console.error('Sync failed:', error);
        }
    } else {
        console.log('You are currently offline. Sync will occur when back online.');
    }
}

export { syncWithServer };
