import { useContext } from "react";
import notecontext from "../Context/notes/noteContext";
import ThemeContext from "../Context/theme/ThemeContext";
import moment from "moment";

const NoteItem = (props) => {
  const { trashNote } = useContext(notecontext);
  const { note, updateNotes, togglePin, onPreviewClick, showAlert } = props;
  const { mode } = useContext(ThemeContext);

  return (
    <div className="col-md-4 mb-4">
      <div
        className={`card shadow-sm h-100 ${mode === "dark" ? "bg-dark text-light" : "bg-white text-dark"}`}
        onClick={() => onPreviewClick(note)} 
        style={{ cursor: "pointer" }}
      >
        <div className="card-body">
          <h5 className="card-title">{note.title}</h5>
          <p className="card-text">
            {note.description.length > 35
              ? note.description.slice(0, 35) + "..."
              : note.description}
          </p>

          <span className="badge bg-info text-dark">
            {note.tag || "General"}
          </span>

          <p className="text-muted mb-1">
            <small>Last updated: {moment(note.date).fromNow()}</small>
          </p>

          <div className="d-flex justify-content-end">
            <i
              className={`fas fa-thumbtack mx-2 ${
                note.pinned ? "text-warning" : mode === "dark" ? "text-light" : "text-muted"
              }`}
              title={note.pinned ? "Unpin" : "Pin"}
              onClick={(e) => {
                e.stopPropagation();
                togglePin(note);
              }}
            ></i>

            <i
              className="fas fa-pen text-primary me-3"
              title="Edit Note"
              onClick={(e) => {
                e.stopPropagation(); 
                updateNotes(note);
              }}
            ></i>

            <i
              className="fas fa-trash text-danger"
              title="Move to Trash"
              onClick={(e) => {
                e.stopPropagation(); 
                trashNote(note._id);
                showAlert("Moved to Trash", "warning");
              }}
            ></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;