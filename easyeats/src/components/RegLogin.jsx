import { useState } from "react";
import "../styles/RegLogin.css";
import bcrypt from "bcryptjs";

export default function RegLogin({ close, onLogin }) {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const getUsers = () => JSON.parse(localStorage.getItem("users")) || [];

  // ---------------- LOGIN ----------------
  const handleLogin = (e) => {
    e.preventDefault();

    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) return setError("The email you've entered does not exist.");

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return setError("Password is incorrect.");

    localStorage.setItem("user", JSON.stringify(user));

    onLogin();
    close();

    setTimeout(() => window.location.reload(), 200); // 🔥 refresh page after login
  };

  // ---------------- REGISTER ----------------
  const handleRegister = (e) => {
    e.preventDefault();

    const username = e.target.username.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    const users = getUsers();

    if (users.some(u => u.email === email))
      return setError("Email is already registered.");

    if (password.length < 6)
      return setError("Password must be at least 6 characters.");

    const hash = bcrypt.hashSync(password, 10);
    const newUser = { username, email, password: hash };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    localStorage.setItem("user", JSON.stringify(newUser));

    onLogin();
    close();

    setTimeout(() => window.location.reload(), 200); // 🔥 refresh after register
  };

  return (
    <div className="popup-bg">
      <div className="popup-card">
        <h2>{mode === "login" ? "Login" : "Register"}</h2>

        {error && <p className="error">{error}</p>}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Log in</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input type="text" name="username" placeholder="Username" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password (min 6)" required />
            <button type="submit">Create Account</button>
          </form>
        )}

        <div className="switch">
          {mode === "login" ? (
            <p>
              Don't have an account?
              <span onClick={() => { setError(""); setMode("register"); }}> Register</span>
            </p>
          ) : (
            <p>
              Already registered?
              <span onClick={() => { setError(""); setMode("login"); }}> Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
