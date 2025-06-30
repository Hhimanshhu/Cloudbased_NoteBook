import React, { useState } from "react";
import NoteContext from "./noteContext";

const Notestate = (props) => {
  const host = `${ import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}`;
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);


  // get all note
  const getNotes = async () => {
    const url = `${host}/api/notes/fetchallnotes`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token"), 
      },
    });
    const json = await response.json();
    setNotes(json);
  };


  // Add a note
  const addNote = async (title, description, tag, pinned) => {
    const url = `${host}/api/notes/addnote`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token"), // Assuming you store the token in localStorage
      },
      body: JSON.stringify({ title, description, tag, pinned}),
    });

    const note = await response.json(); // assuming backend returns the saved note
    setNotes(notes.concat(note));
  };


  // Delete a note
  const deleteNote = async (id) => {
    const url = `${host}/api/notes/deletenote/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          localStorage.getItem("token"), // Assuming you store the token in localStorage
      },
    });
    await response.json();
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  };


  // Edit a note
  const editNote = async (id, title, description, tag, pinned = false) => {
    const url = `${host}/api/notes/updatenote/${id}`;

    const response = await fetch(url, {
      method: "PUT", // Use PUT or PATCH for updates
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"), // Assuming you store the token in localStorage,
      },
      body: JSON.stringify({ title, description, tag, pinned }),
    });

    await response.json();

    // Now update the state locally only if server updated successfully
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) { 
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        newNotes[index].pinned = pinned;
        break;
      }
    }
    setNotes(newNotes);
  };


  // Move Note to Trash
const trashNote = async (id) => {
  const response = await fetch(`${host}/api/notes/trashnote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  await response.json();
  getNotes();
};


// Restore Note from Trash
const restoreNote = async (id) => {
  const response = await fetch(`${host}/api/notes/restorenote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  await response.json();
  getNotes();
};


// Permanently Delete from Trash
const deleteForeverNote = async (id) => {
  const response = await fetch(`${host}/api/notes/deleteforever/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("token"),
    },
  });
  await response.json();
  getNotes();
};

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes,trashNote, restoreNote, deleteForeverNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
export default Notestate;
