import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import notecontext from "../Context/notes/noteContext";
import Notes from "./Notes";

const Home = (props) => {
  const navigate = useNavigate();
  const context = useContext(notecontext);
  const { getNotes } = context;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      props.showAlert("Please login to continue", "danger");
      navigate("/login");
    } else {
      getNotes();
    }
    // eslint-disable-next-line
  }, []);

  // Do NOT render Notes if not authenticated
  if (!localStorage.getItem("token")) {
    return null;
  }

  return (
    <div>
      <Notes showAlert={props.showAlert} />
    </div>
  );
};


export default Home;








// import React, { useEffect, useContext, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import notecontext from "../Context/notes/noteContext";
// import Notes from "./Notes";

// const Home = (props) => {
//   const navigate = useNavigate();
//   const context = useContext(notecontext);
//   const { notes, getNotes } = context;

//   useEffect(() => {
//     if (!localStorage.getItem("token")) {
//       props.showAlert("Please login to continue", "danger");
//       navigate("/login");
//     } else {
//       getNotes();
//     }
//     // eslint-disable-next-line
//   }, []);

//   // Do NOT render Notes if not authenticated
//   if (!localStorage.getItem("token")) {
//     return null;
//   }

//   return (
//     <div>
//       <Notes showAlert={props.showAlert} />
//     </div>
//   );
// };


// export default Home;
