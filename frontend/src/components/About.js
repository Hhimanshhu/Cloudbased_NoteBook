import React, { useEffect } from "react";

const About = () => {
  useEffect(() => {
    document.title = "Login | NovaBook";
  }, []);

  return (
    <div className="container my-5">
      <h1 className="mb-4">About NovaBook</h1>

      <section className="mb-4">
        <h4>📘 What is NovaBook?</h4>
        <p>
          NovaBook is your personal note management application where you can
          securely create, update, and delete notes. Built with simplicity and
          speed in mind, it's perfect for students, professionals, and anyone
          who wants to organize their thoughts.
        </p>
      </section>

      <section className="mb-4">
        <h4>📝 How Does It Work?</h4>
        <ul>
          <li>Create an account and log in securely</li>
          <li>Add, edit, and delete your personal notes</li>
          <li>
            Your notes are stored securely and privately using authentication
          </li>
          <li>
            Switch between light and dark mode for your preferred experience
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h4>📜 Terms & Conditions</h4>
        <p>By using NovaBook, you agree that:</p>
        <ul>
          <li>You are responsible for the content you save</li>
          <li>You will not use NovaBook for illegal or abusive purposes</li>
          <li>The app is provided "as is" without warranties of any kind</li>
        </ul>
      </section>

      <section className="mb-4">
        <h4>🔒 Privacy & Security</h4>
        <p>
          We value your privacy. Your notes are linked to your account and
          stored securely. Your data is not shared with any third parties.
        </p>
      </section>
    </div>
  );
};

export default About;
