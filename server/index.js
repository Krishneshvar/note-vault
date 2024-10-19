app.post('/sync-notes', async (req, res) => {
    const notes = req.body.notes;  // Array of notes from client
    
    // Insert each note into PostgreSQL
    try {
      const query = 'INSERT INTO notes (content, created_at) VALUES ($1, $2)';
      for (const note of notes) {
        await pool.query(query, [note.content, note.created_at]);
      }
      res.status(200).send('Notes synchronized successfully.');
    } catch (err) {
      res.status(500).send('Error syncing notes');
    }
});
  