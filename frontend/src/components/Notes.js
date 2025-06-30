import React, { useContext, useEffect, useRef, useState } from "react";
import notecontext from "../Context/notes/noteContext";
import NoteItem from "./NoteItem";
import AddNote from "./AddNote";
import ThemeContext from "../Context/theme/ThemeContext";
import SkeletonCard from "./SkeletonCard";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import NotePreviewModal from "./NotePreviewModal";

const Notes = (props) => {
  useEffect(() => {
    document.title = "Whatever Title | NovaBook";
  }, []);

  const context = useContext(notecontext);
  const [selectedTag, setSelectedTag] = useState("All");
  const { notes, getNotes, editNote } = context;
  const { mode } = useContext(ThemeContext);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("date-desc");
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (selectedNote) {
      const modal = new window.bootstrap.Modal(
        document.getElementById("notePreviewModal")
      );
      modal.show();
    }
  }, [selectedNote]);

  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("token")) {
        setLoading(true);
        await getNotes();
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ref = useRef(null);
  const refClose = useRef(null);

  const [editingNote, setEditingNote] = useState({
    id: "",
    etitle: "",
    edescription: "",
    etag: "",
    epinned: false,
  });

  const updateNotes = (currentnote) => {
    ref.current.click();
    setEditingNote({
      id: currentnote._id,
      etitle: currentnote.title,
      edescription: currentnote.description,
      etag: currentnote.tag,
      epinned: currentnote.pinned,
    });
  };

  const handleClick = (e) => {
    editNote(editingNote.id, editingNote.etitle, editingNote.edescription, editingNote.etag, editingNote.epinned);
    refClose.current.click();
    e.preventDefault();
    props.showAlert("Note Updated Successfully", "success");
  };

  const onchange = (e) => {
    setEditingNote({ ...editingNote, [e.target.name]: e.target.value });
  };

  // Filter notes by title or description
  // Filter by both tag and search
  const filteredNotes = notes
    .filter((note) => !note.trashed) // 👈 hide trashed notes
    .filter((note) => {
      const matchesSearch = (note.title + note.description)
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTag = selectedTag === "All" || note.tag === selectedTag;

      return matchesSearch && matchesTag;
    });

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date);
    if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date);
    if (sortOption === "title-asc") return a.title.localeCompare(b.title);
    if (sortOption === "title-desc") return b.title.localeCompare(a.title);
    return 0;
  });

  const pinnedNotes = sortedNotes.filter((note) => note.pinned);
  const unpinnedNotes = sortedNotes.filter((note) => !note.pinned);

  const togglePin = (note) => {
    editNote(note._id, note.title, note.description, note.tag, !note.pinned);
  };
  const isEmpty =
    pinnedNotes.length === 0 && unpinnedNotes.length === 0 && !loading;

  const downloadBlob = (blob, filename) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  const handleNoteClick = (note) => {
    setSelectedNote(null); // Reset first to force change
    setTimeout(() => {
      setSelectedNote(note);
    }, 0); // Small delay to allow re-render
  };

  const handleExportTxt = () => {
    const content = notes
      .filter((note) => !note.trashed)
      .map(
        (note, i) =>
          `Note ${i + 1}:\nTitle: ${note.title}\nDescription: ${
            note.description
          }\nTag: ${note.tag}\n\n`
      )
      .join("");

    const blob = new Blob([content], { type: "text/plain" });
    downloadBlob(blob, "mynotes.txt");
  };

  const handleExportJson = () => {
    const filtered = notes.filter((note) => !note.trashed);
    const blob = new Blob([JSON.stringify(filtered, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, "mynotes.json");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const filteredNotes = notes.filter((note) => !note.trashed);

    doc.setFontSize(18);
    doc.text("My Notes", 14, 20);

    const tableData = filteredNotes.map((note, i) => [
      i + 1,
      note.title,
      note.description,
      note.tag || "General",
      new Date(note.date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["#", "Title", "Description", "Tag", "Date"]],
      body: tableData,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [52, 58, 64],
      },
    });

    doc.save("mynotes.pdf");
  };

  return (
   <div>
      <AddNote showAlert={props.showAlert} />
       <h1 align="center">Your notes</h1>
       

      {/* Top Controls Row */}
      <div className="container my-5">
        <div className="row mb-3 align-items-end">
          {/* Search Input */}
          <div className="col-md-3 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search Notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tag Filter */}
          <div className="col-md-3 mb-2">
            <select
              className={`form-select ${mode === "dark" ? "bg-dark text-light border-secondary" : ""}`}
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
            >
              <option value="All">All Tags</option>
              {[...new Set(notes.filter((note) => !note.trashed).map((note) => note.tag))]
                .filter((tag) => tag)
                .map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
            </select>
          </div>

          {/* Sort Option */}
          <div className="col-md-3 mb-2">
            <select
              className={`form-select ${mode === "dark" ? "bg-dark text-light border-secondary" : ""}`}
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date-desc">🕒 Newest First</option>
              <option value="date-asc">🕒 Oldest First</option>
              <option value="title-asc">🔤 A-Z</option>
              <option value="title-desc">🔤 Z-A</option>
            </select>
          </div>

          {/* Download Button */}
          <div className="col-md-3 mb-2 text-end">
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100"
                type="button"
                id="downloadDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                ⬇️ Download Notes
              </button>
              <ul className="dropdown-menu" aria-labelledby="downloadDropdown">
                <li><button className="dropdown-item" onClick={handleExportTxt}>📄 Export as .txt</button></li>
                <li><button className="dropdown-item" onClick={handleExportJson}>🧾 Export as .json</button></li>
                <li><button className="dropdown-item" onClick={handleExportPDF}>📚 Export as .pdf</button></li>
              </ul>
            </div>
          </div>
        </div>



        {/* Edit Note Modal (Bootstrap) */}
        <button
          type="button"
          className="btn btn-primary d-none"
          ref={ref}
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Launch demo modal
        </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Your Note</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="etitle" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="etitle"
                      name="etitle"
                      value={editingNote.etitle}
                      onChange={onchange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="edescription" className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="edescription"
                      name="edescription"
                      value={editingNote.edescription}
                      onChange={onchange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="etag" className="form-label">Tag</label>
                    <input
                      type="text"
                      className="form-control"
                      id="etag"
                      name="etag"
                      value={editingNote.etag}
                      onChange={onchange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button ref={refClose} className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button
                  className="btn btn-primary"
                  onClick={handleClick}
                  disabled={editingNote.etitle.length < 5 || editingNote.edescription.length < 5}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Section */}
        <div className="row my-3">
          {isEmpty && (
            <div className="text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png" alt="Empty" style={{ width: "120px", opacity: 0.5 }} />
              <h5 className="mt-3">No notes found</h5>
              <p className="text-muted">Create your first note above.</p>
            </div>
          )}

          {pinnedNotes.length > 0 && (
            <>
              <h4 className="mt-4">📌 Pinned</h4>
              {loading
                ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : pinnedNotes.map((note) => (
                    <NoteItem
                      key={note._id}
                      note={note}
                      updateNotes={updateNotes}
                      showAlert={props.showAlert}
                      togglePin={togglePin}
                      mode={mode}
                      onPreviewClick={handleNoteClick}
                    />
                  ))}
            </>
          )}

          {unpinnedNotes.length > 0 && (
            <>
              <h4 className="mt-4">🗂️ Others</h4>
              {loading
                ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : unpinnedNotes.map((note) => (
                    <NoteItem
                      key={note._id}
                      note={note}
                      updateNotes={updateNotes}
                      showAlert={props.showAlert}
                      togglePin={togglePin}
                      onPreviewClick={handleNoteClick}
                    />
                  ))}
            </>
          )}
        </div>
      </div>

      <NotePreviewModal note={selectedNote} mode={mode} />
    </div>
  );
};


export default Notes;











// import React, { useContext, useEffect, useRef, useState } from "react";
// import notecontext from "../Context/notes/noteContext";
// import NoteItem from "./NoteItem";
// import AddNote from "./AddNote";
// import ThemeContext from "../Context/theme/ThemeContext";
// import SkeletonCard from "./SkeletonCard";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import autoTable from "jspdf-autotable";
// import NotePreviewModal from "./NotePreviewModal";

// const Notes = (props) => {
//   useEffect(() => {
//     document.title = "Whatever Title | NovaBook";
//   }, []);

//   const context = useContext(notecontext);
//   const [selectedTag, setSelectedTag] = useState("All");
//   const { notes, getNotes, editNote } = context;
//   const { mode } = useContext(ThemeContext);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sortOption, setSortOption] = useState("date-desc");
//   const [selectedNote, setSelectedNote] = useState(null);

//   useEffect(() => {
//     if (selectedNote) {
//       const modal = new window.bootstrap.Modal(
//         document.getElementById("notePreviewModal")
//       );
//       modal.show();
//     }
//   }, [selectedNote]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (localStorage.getItem("token")) {
//         setLoading(true);
//         await getNotes();
//         setLoading(false);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const ref = useRef(null);
//   const refClose = useRef(null);

//   const [note, setNote] = useState({
//     id: "",
//     etitle: "",
//     edescription: "",
//     etag: "",
//     epinned: false,
//   });

//   const updateNotes = (currentnote) => {
//     ref.current.click();
//     setNote({
//       id: currentnote._id,
//       etitle: currentnote.title,
//       edescription: currentnote.description,
//       etag: currentnote.tag,
//       epinned: currentnote.pinned,
//     });
//   };

//   const handleClick = (e) => {
//     editNote(note.id, note.etitle, note.edescription, note.etag, note.epinned);
//     refClose.current.click();
//     e.preventDefault();
//     props.showAlert("Note Updated Successfully", "success");
//   };

//   const onchange = (e) => {
//     setNote({ ...note, [e.target.name]: e.target.value });
//   };

//   // Filter notes by title or description
//   // Filter by both tag and search
//   const filteredNotes = notes
//     .filter((note) => !note.trashed) // 👈 hide trashed notes
//     .filter((note) => {
//       const matchesSearch = (note.title + note.description)
//         .toLowerCase()
//         .includes(search.toLowerCase());

//       const matchesTag = selectedTag === "All" || note.tag === selectedTag;

//       return matchesSearch && matchesTag;
//     });

//   const sortedNotes = [...filteredNotes].sort((a, b) => {
//     if (sortOption === "date-desc") return new Date(b.date) - new Date(a.date);
//     if (sortOption === "date-asc") return new Date(a.date) - new Date(b.date);
//     if (sortOption === "title-asc") return a.title.localeCompare(b.title);
//     if (sortOption === "title-desc") return b.title.localeCompare(a.title);
//     return 0;
//   });

//   const pinnedNotes = sortedNotes.filter((note) => note.pinned);
//   const unpinnedNotes = sortedNotes.filter((note) => !note.pinned);

//   const togglePin = (note) => {
//     editNote(note._id, note.title, note.description, note.tag, !note.pinned);
//   };
//   const isEmpty =
//     pinnedNotes.length === 0 && unpinnedNotes.length === 0 && !loading;

//   const downloadBlob = (blob, filename) => {
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = filename;
//     link.click();
//     URL.revokeObjectURL(link.href);
//   };
//   const handleNoteClick = (note) => {
//     setSelectedNote(null); // Reset first to force change
//     setTimeout(() => {
//       setSelectedNote(note);
//     }, 0); // Small delay to allow re-render
//   };

//   const handleExportTxt = () => {
//     const content = notes
//       .filter((note) => !note.trashed)
//       .map(
//         (note, i) =>
//           `Note ${i + 1}:\nTitle: ${note.title}\nDescription: ${
//             note.description
//           }\nTag: ${note.tag}\n\n`
//       )
//       .join("");

//     const blob = new Blob([content], { type: "text/plain" });
//     downloadBlob(blob, "mynotes.txt");
//   };

//   const handleExportJson = () => {
//     const filtered = notes.filter((note) => !note.trashed);
//     const blob = new Blob([JSON.stringify(filtered, null, 2)], {
//       type: "application/json",
//     });
//     downloadBlob(blob, "mynotes.json");
//   };

//   const handleExportPDF = () => {
//     const doc = new jsPDF();
//     const filteredNotes = notes.filter((note) => !note.trashed);

//     doc.setFontSize(18);
//     doc.text("My Notes", 14, 20);

//     const tableData = filteredNotes.map((note, i) => [
//       i + 1,
//       note.title,
//       note.description,
//       note.tag || "General",
//       new Date(note.date).toLocaleDateString(),
//     ]);

//     autoTable(doc, {
//       startY: 30,
//       head: [["#", "Title", "Description", "Tag", "Date"]],
//       body: tableData,
//       styles: {
//         fontSize: 10,
//         cellPadding: 3,
//       },
//       headStyles: {
//         fillColor: [52, 58, 64],
//       },
//     });

//     doc.save("mynotes.pdf");
//   };

//   return (
//     <div>
//       <AddNote showAlert={props.showAlert} />
// <br/>
//       <div className="container my-3">
//         <div className="row mb-3">
//           <div className="col-md-3">
//             <select
//               className={`form-select ${
//                 mode === "dark" ? "bg-dark text-light border-secondary" : ""
//               }`}
//               value={selectedTag}
//               onChange={(e) => setSelectedTag(e.target.value)}
//             >
//               <option value="All">All Tags</option>
//               {[
//                 ...new Set(
//                   notes
//                     .filter((note) => !note.trashed) // 👈 filter out trashed notes
//                     .map((note) => note.tag)
//                 ),
//               ]
//                 .filter((tag) => tag) // Optional: remove empty tags
//                 .map((tag) => (
//                   <option key={tag} value={tag}>
//                     {tag}
//                   </option>
//                 ))}
//             </select>
//           </div>
//           <div className="col-md-3">
//             <select
//               className={`form-select ${
//                 mode === "dark" ? "bg-dark text-light border-secondary" : ""
//               }`}
//               value={sortOption}
//               onChange={(e) => setSortOption(e.target.value)}
//             >
//               <option value="date-desc">🕒 Newest First</option>
//               <option value="date-asc">🕒 Oldest First</option>
//               <option value="title-asc">🔤 A-Z</option>
//               <option value="title-desc">🔤 Z-A</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {/* Hidden Modal Trigger Button */}
//       <button
//         type="button"
//         className="btn btn-primary d-none"
//         ref={ref}
//         data-bs-toggle="modal"
//         data-bs-target="#exampleModal"
//       >
//         Launch demo modal
//       </button>

//       {/* Modal */}
//       <div
//         className="modal fade"
//         id="exampleModal"
//         tabIndex="-1"
//         aria-labelledby="exampleModalLabel"
//         aria-hidden="true"
//       >
//         <div className="modal-dialog">
//           <div className="modal-content">
//             <div className="modal-header">
//               <h1 className="modal-title fs-5" id="exampleModalLabel">
//                 Edit Your Note
//               </h1>
//               <button
//                 type="button"
//                 className="btn-close"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               ></button>
//             </div>
//             <div className="modal-body">
//               <form className="My-3">
//                 <div className="mb-3">
//                   <label htmlFor="title" className="form-label">
//                     Title
//                   </label>
//                   <input
//                     type="text"
//                     value={note.etitle}
//                     className="form-control"
//                     id="etitle"
//                     name="etitle"
//                     onChange={onchange}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="description" className="form-label">
//                     Description
//                   </label>
//                   <input
//                     type="text"
//                     value={note.edescription}
//                     className="form-control"
//                     id="edescription"
//                     name="edescription"
//                     onChange={onchange}
//                   />
//                 </div>
//                 <div className="mb-3">
//                   <label htmlFor="tag" className="form-label">
//                     Tag
//                   </label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     value={note.etag}
//                     id="etag"
//                     name="etag"
//                     onChange={onchange}
//                   />
//                 </div>
//               </form>
//             </div>
//             <div className="modal-footer">
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 data-bs-dismiss="modal"
//                 ref={refClose}
//               >
//                 Close
//               </button>
//               <button
//                 disabled={
//                   note.etitle.length < 5 || note.edescription.length < 5
//                 }
//                 type="button"
//                 onClick={handleClick}
//                 className="btn btn-primary"
//               >
//                 Save changes
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Top Actions Row: Search + Download */}
//       <div className="container my-3">
//         <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
//           {/* Left-aligned: Heading */}
//           <h2 className="mb-0">Your Notes</h2>

//           {/* Right-aligned group: Download + Search */}
//           <div className="d-flex align-items-center gap-2 ms-auto">
//             <input
//               type="text"
//               className="form-control"
//               style={{ maxWidth: "250px" }}
//               placeholder="🔍 Search Notes..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <div className="dropdown">
//               <button
//                 className="btn btn-outline-secondary dropdown-toggle"
//                 type="button"
//                 id="downloadDropdown"
//                 data-bs-toggle="dropdown"
//                 aria-expanded="false"
//               >
//                 ⬇️ Download Notes
//               </button>
//               <ul className="dropdown-menu" aria-labelledby="downloadDropdown">
//                 <li>
//                   <button className="dropdown-item" onClick={handleExportTxt}>
//                     📄 Export as .txt
//                   </button>
//                 </li>
//                 <li>
//                   <button className="dropdown-item" onClick={handleExportJson}>
//                     🧾 Export as .json
//                   </button>
//                 </li>
//                 <li>
//                   <button className="dropdown-item" onClick={handleExportPDF}>
//                     📚 Export as .pdf
//                   </button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//         {/* </div> */}

//         <div className="row my-3">
//           {isEmpty && (
//             <>
//               <img
//                 src="https://cdn-icons-png.flaticon.com/512/4076/4076500.png"
//                 alt="Empty"
//                 style={{ width: "120px", opacity: 0.5 }}
//               />
//               <h5 className="mt-3">No notes found</h5>
//               <p className="text-muted">Create your first note above.</p>
//             </>
//           )}

//           {/* Pinned Notes */}
//           {pinnedNotes.length > 0 && (
//             <>
//               <h4 className="mt-4">📌 Pinned</h4>
//               {loading ? (
//                 <>
//                   <SkeletonCard />
//                   <SkeletonCard />
//                   <SkeletonCard />
//                 </>
//               ) : (
//                 pinnedNotes.map((note) => (
//                   <NoteItem
//                     key={note._id}
//                     note={note}
//                     updateNotes={updateNotes}
//                     showAlert={props.showAlert}
//                     togglePin={togglePin}
//                     mode={mode}
//                     onPreviewClick={handleNoteClick}
//                   />
//                 ))
//               )}
//             </>
//           )}

//           {/* Unpinned Notes */}
//           {unpinnedNotes.length > 0 && (
//             <>
//               <h4 className="mt-4">🗂️ Others</h4>
//               {loading ? (
//                 <>
//                   <SkeletonCard />
//                   <SkeletonCard />
//                   <SkeletonCard />
//                 </>
//               ) : (
//                 unpinnedNotes.map((note) => (
//                   <NoteItem
//                     key={note._id}
//                     note={note}
//                     updateNotes={updateNotes}
//                     showAlert={props.showAlert}
//                     togglePin={togglePin}
//                     onPreviewClick={handleNoteClick}
//                   />
//                 ))
//               )}
//             </>
//           )}
//         </div>
//         <NotePreviewModal note={selectedNote} mode={mode} />
//       </div>
//     </div>
//   );
// };

// export default Notes;

