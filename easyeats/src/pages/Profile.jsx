import { useEffect, useState } from "react";
import RegLogin from "../components/RegLogin";
import bcrypt from "bcryptjs";
import "../styles/Profile.css";

export default function Profile() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setLoggedIn(true);
    } else {
      setTimeout(() => setShowPopup(true), 200);
    }
  }, []);

  // --- Profile picture update ---
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedUser = { ...user, pfp: reader.result };

      setUser(updatedUser);
      updateUserStorage(updatedUser);
    };

    reader.readAsDataURL(file);
  };

  // --- Save changes (username/password) ---
  const saveChanges = () => {
    if (!newUsername && !newPassword) {
      alert("Fill in at least one field to make changes.");
      return;
    }

    let updatedUser = { ...user };

    if (newUsername) updatedUser.username = newUsername;

    if (newPassword) {
      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
      }
      updatedUser.password = bcrypt.hashSync(newPassword, 10);
    }

    updateUserStorage(updatedUser);

    alert("Changes saved. Please log in again.");
    logout(); // auto logout afterwards
  };

  const updateUserStorage = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map(u =>
      u.email === updatedUser.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

const logout = () => {
  localStorage.removeItem("user");
  setLoggedIn(false);
  setShowPopup(true);

  setTimeout(() => {
    window.location.reload();
  }, 300);
};


  return (
    <div className="profile-container">
      <div className="profile-card">

        {loggedIn ? (
          <>
            {/* TOP SECTION */}
            <div className="profile-top">
              <label className="pfp-wrapper">
                <img src={user?.pfp || "/defaultpfp.png"} alt="pfp" className="profile-pfp" />
                <input type="file" accept="image/*" onChange={handleFile} className="hidden-file"/>
              </label>

              <div>
                <h2 className="profile-title">Hi, {user.username} 👋</h2>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>

            {/* EDIT SECTION */}
            <div className="edit-form">
              <input
                type="text"
                placeholder="New username (optional)"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="New password (optional, min 6)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button className="save-btn" onClick={saveChanges}>Save changes</button>
            </div>

            {/* LOGOUT */}
            <button className="logout-btn" onClick={logout}>Logout</button>

            {/* RECIPES SECTION */}
            <div className="recipes-section">
              <h3>My Recipes</h3>
              <p>You haven't uploaded any recipes yet.</p>
            </div>
          </>
        ) : (
          <p>You must be logged in to view your profile.</p>
        )}

        {showPopup && (
          <RegLogin
            onLogin={() => { setLoggedIn(true); setShowPopup(false); }}
            close={() => setShowPopup(false)}
          />
        )}
      </div>
    </div>
  );
}
