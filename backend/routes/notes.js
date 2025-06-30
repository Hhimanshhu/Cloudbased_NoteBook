const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//Route 1: Fetch all notes using GET "/api/notes/fetchallnotes". Login required...............................................................
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id }); // <-- add await here
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 2: Add a new note using POST "/api/notes/addnote". Login required...............................................................
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters long').isLength({ min: 5 }),
    body('tag', 'Tag must be at least 1 character long')
], async (req, res) => {
    // Checking for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tag } = req.body;

    try {
        const note = new Notes({
            title,
            description,
            tag,
            user: req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
}); 


//Route 3: Update an existing note using PUT "/api/notes/updatenote/:id". Login required.................................................. 
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag, pinned } = req.body;

    // Create a new note object
    const newNote = {};
    if (title) { newNote.title = title; }
    if (description) { newNote.description = description; }
    if (tag) { newNote.tag = tag; }
    if (pinned !== undefined) newNote.pinned = pinned;
    newNote.date = Date.now(); 


    // Find the note to be updated and update it
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Not Found");
        }

        // Check if the user is authorized to update this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

//Route 4: Delete an existing note using DELETE "/api/notes/deletenote/:id". Login required..................................................
router.put('/trashnote/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Not Allowed");

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: { trashed: true } },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


// Route 5: Restorenote a note using PUT "/api/notes/restorenote/:id". Login required..........................................................
// Route: Restore from Trash
router.put('/restorenote/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Not Allowed");

    note.trashed = false;
    await note.save();

    res.json({ message: "Note restored", note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//Route 5: Delete an existing note using DELETE "/api/notes/deletenote/:id". Login required..................................................// Route: Permanently Delete a Trashed Note
router.delete('/deleteforever/:id', fetchuser, async (req, res) => {
  try {
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not Found");

    if (note.user.toString() !== req.user.id)
      return res.status(401).send("Not Allowed");

    // Only allow delete if note is already trashed
    if (!note.trashed) {
      return res.status(400).send("Note is not in trash");
    }

    await Notes.findByIdAndDelete(req.params.id);

    res.json({ message: "Note permanently deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});


module.exports = router;
