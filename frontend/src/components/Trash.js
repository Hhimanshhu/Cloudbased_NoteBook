// src/components/Trash.js
import React, { useContext, useEffect } from "react";
import noteContext from "../Context/notes/noteContext";
import ThemeContext from "../Context/theme/ThemeContext";

const Trash = ({ showAlert }) => {
  useEffect(() => {
    document.title = "Whatever Title | NovaBook";
  }, []);

  const { notes, getNotes, restoreNote, deleteForeverNote } =
    useContext(noteContext);
  const { mode } = useContext(ThemeContext);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [noteToDelete, setNoteToDelete] = React.useState(null);
  const trashedNotes = notes.filter((note) => note.trashed);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getNotes();
    }
  }, [getNotes]);

  return (
    <div className="container mt-5">
      {showConfirm && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${
                mode === "dark" ? "bg-dark text-light" : ""
              }`}
            >
              <div className="modal-header">
                <h5 className="modal-title text-danger">Delete Permanently?</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirm(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to permanently delete{" "}
                  <strong>{noteToDelete?.title}</strong>?
                </p>
                <p className="text-muted small">
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    deleteForeverNote(noteToDelete._id);
                    showAlert("Note deleted permanently", "danger");
                    setShowConfirm(false);
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <h2 className="mb-4">🗑️ Trashed Notes</h2>

      {trashedNotes.length === 0 ? (
        <p className="text-muted">Nothing in trash.</p>
      ) : (
        <div className="row">
          {trashedNotes.map((note) => (
            <div className="col-md-4 mb-3" key={note._id}>
              <div
                className={`card h-100 shadow-sm ${
                  mode === "dark" ? "bg-dark text-light" : ""
                }`}
              >
                <div className="card-body">
                  <h5>{note.title}</h5>
                  <p>{note.description}</p>
                  <span className="badge bg-secondary">{note.tag}</span>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button
                    className="btn btn-sm btn-outline-success"
                    onClick={() => {
                      restoreNote(note._id);
                      showAlert("Note restored", "success");
                    }}
                  >
                    ♻️ Restore
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      setNoteToDelete(note);
                      setShowConfirm(true);
                    }}
                  >
                    ❌ Delete Forever
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash;
