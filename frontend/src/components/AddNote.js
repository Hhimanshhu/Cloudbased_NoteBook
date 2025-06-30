import React, { useState, useContext, useEffect } from "react";
import notecontext from "../Context/notes/noteContext"; 

const AddNote = (props) => {
  const context = useContext(notecontext);
  const { addNote } = context;

  const [note, setNote] = useState({ title: "", description: "", tag: "Default" });
  const [showInfo, setShowInfo] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  // Check localStorage on load
  useEffect(() => {
    const hasSeenMessage = localStorage.getItem("hasSeenInfoMessage");
    if (hasSeenMessage === "true") {
      setShowInfo(false);
    }
  }, []);

  const handleClick = (e) => {
    e.preventDefault();

    if (showInfo && !isChecked) {
      props.showAlert("Please agree to the secure notes info.", "danger");
      return;
    }

    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });

    // Hide info after first submission
    if (showInfo) {
      localStorage.setItem("hasSeenInfoMessage", "true");
      setShowInfo(false);
    }

    props.showAlert("Note Added Successfully", "success");
  };

  const onchange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div className="container my-3">
      <h2>Add Notes</h2>
      <form className="My-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={note.title}
            onChange={onchange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={onchange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onchange}
          />
        </div>

        {showInfo && (
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Your Notes are all secure with us.
            </label>
          </div>
        )}

        <button
          className="btn btn-primary"
          disabled={note.title.length < 5 || note.description.length < 5}
          onClick={handleClick}
          >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddNote;













// import React, { useState } from "react";
// import notecontext from "../Context/notes/noteContext"; 
// import { useContext } from "react";


// const AddNote = (props) => {
//     const context = useContext(notecontext);
//     const {addNote} = context;

//     const [note, setNote] = useState({ title: "", description: "", tag: "Default" });
    
//     const handleClick = (e) => {
//         e.preventDefault();
//         addNote(note.title, note.description, note.tag);
//         setNote({ title: "", description: "", tag: "" }); // Reset the form after submission
//         props.showAlert("Note Added Successfully", "success");
//     }


//     const onchange = (e) => {
//         setNote({ ...note, [e.target.name]: e.target.value });
//     }

//   return (
//     <div className="container my-3">
//       <h2>Add Notes</h2>
//       <form className="My-3">
//         <div className="mb-3">
//           <label htmlFor="title" className="form-label">
//             Title
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="title"
//             name="title"
//             aria-describedby="emailHelp"
//             value={note.title}
//             onChange={onchange}
//           />
         
//         </div>
//         <div className="mb-3">
//           <label htmlFor="description" className="form-label">
//             Description
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="description"
//             name="description"
//             value={note.description}
//             aria-describedby="emailHelp"
//             onChange={onchange}
//           />
//         </div>
       

//         <div className="mb-3">
//           <label htmlFor="tag" className="form-label">
//             Tag
//           </label>
//           <input
//             type="text"
//             className="form-control"
//             id="tag"
//             name="tag"
//             value={note.tag}
//             aria-describedby="emailHelp"
//             onChange={onchange}
//           />
//         </div>

//         <div className="mb-3 form-check">
//           <input
//             type="checkbox"
//             className="form-check-input"
//             id="exampleCheck1"
//           />

//           <label className="form-check-label" htmlFor="exampleCheck1">
//             Your Notes are all secure with us.
//           </label>
//         </div>
//         <button disabled={note.title.length<5 || note.description.length<5} type="submit" onClick={handleClick} className="btn btn-primary">
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddNote;
