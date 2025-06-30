import React, { useState, useEffect } from "react";
import ThemeContext from "./ThemeContext";

const ThemeState = (props) => {
  // Load initial mode from localStorage or default to 'light'
  const [mode, setMode] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    //  Apply mode class to body
    document.body.classList.toggle("dark", mode === "dark");
    document.body.classList.toggle("light", mode === "light");

    // Save to localStorage
    localStorage.setItem("theme", mode);

    // Apply color styles too
    document.body.style.backgroundColor = mode === "dark" ? "#1f1f1f" : "white";
    document.body.style.color = mode === "dark" ? "white" : "black";
  }, [mode]);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeState;
