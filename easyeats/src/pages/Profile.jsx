import { useEffect, useState } from "react";
import RegLogin from "../components/RegLogin";
import bcrypt from "bcryptjs";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
    logout();
  };

  const updateUserStorage = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );

    const exists = updatedUsers.some((u) => u.email === updatedUser.email);
    if (!exists) updatedUsers.push(updatedUser);

    localStorage.setItem("users", JSON.stringify(updatedUsers));
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setLoggedIn(false);
    setTimeout(() => setShowPopup(true), 200);
  };

  const deleteRecipe = (id) => {
    if (!user) return;
    if (!confirm("Are you sure you want to delete this recipe?")) return;

    const updatedUser = {
      ...user,
      myRecipes: (user.myRecipes || []).filter((r) => r.id !== id),
    };
    updateUserStorage(updatedUser);

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updatedUsers = users.map((u) =>
      u.email === updatedUser.email ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    const globalRecipes = JSON.parse(localStorage.getItem("recipes")) || [];
    const newGlobal = globalRecipes.filter((r) => r.id !== id);
    localStorage.setItem("recipes", JSON.stringify(newGlobal));

    setUser(updatedUser);
  };

  const openRecipe = (id) => {
    navigate(`/recipe/${id}`);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {loggedIn && user ? (
          <>
            <div className="profile-top">
              <label className="pfp-wrapper">
                <img
                  src={user?.pfp || "/defaultpfp.png"}
                  alt="pfp"
                  className="profile-pfp"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden-file"
                />
              </label>

              <div className="profile-meta">
                <h2 className="profile-title">Hi, {user.username} 👋</h2>
                <p className="profile-email">{user.email}</p>
              </div>
            </div>

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

              <button className="save-btn" onClick={saveChanges}>
                Save changes
              </button>
            </div>

            <button className="logout-btn" onClick={logout}>Logout</button>

            <div className="recipes-section">
              <h3>My Recipes</h3>

              {(!user.myRecipes || user.myRecipes.length === 0) && (
                <p>You haven't uploaded any recipes yet.</p>
              )}

              {user.myRecipes?.map((r) => (
                <div
                  key={r.id}
                  className="my-recipe-card"
                  onClick={() => openRecipe(r.id)}
                >
                  <div className="my-recipe-left">
                    <strong>{r.name}</strong>
                    <div className="meta">
                      {r.category} • {r.time} min • {r.persons}p
                    </div>
                  </div>

                  <div className="my-recipe-actions">
                    <button
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRecipe(r.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>You must be logged in to view your profile.</p>
        )}

        {showPopup && (
          <RegLogin
            onLogin={() => {
              const u = JSON.parse(localStorage.getItem("user"));
              setUser(u);
              setLoggedIn(true);
              setShowPopup(false);
            }}
            close={() => setShowPopup(false)}
          />
        )}
      </div>
    </div>
  );
}
