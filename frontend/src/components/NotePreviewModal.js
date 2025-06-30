import React from "react";
import moment from "moment";

const NotePreviewModal = ({ note, mode }) => {
  if (!note) return null;

  return (
    <div
      className="modal fade"
      id="notePreviewModal"
      tabIndex="-1"
      aria-labelledby="notePreviewModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className={`modal-content ${mode === "dark" ? "bg-dark text-light" : ""}`}>
          <div className="modal-header">
            <h5 className="modal-title" id="notePreviewModalLabel">📝 Note Preview</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <h4>{note.title}</h4>
            <p className="mt-3">{note.description}</p>
            <hr />
            <p><strong>Tag:</strong> {note.tag || "General"}</p>
            <p><strong>Created:</strong> {moment(note.date).format("LLL")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotePreviewModal;
