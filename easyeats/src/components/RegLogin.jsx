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
    setTimeout(() => window.location.reload(), 200);
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
    setTimeout(() => window.location.reload(), 200);
  };

  return (
    <div className="popup-bg">
      <div className="popup-card">

        <button className="close-x" onClick={() => window.location.href = "/home"}>✕</button>

        <h2>{mode === "login" ? "Login" : "Register"}</h2>
        {error && <p className="error">{error}</p>}

        {mode === "login" ? (
          <form onSubmit={handleLogin}>
            <input className="input" type="email" name="email" placeholder="Email" required />
            <input className="input" type="password" name="password" placeholder="Password" required />
            <button className="button" type="submit">Log in</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <input className="input" type="text" name="username" placeholder="Username" required maxLength={20}/>
            <input className="input" type="email" name="email" placeholder="Email" required />
            <input className="input" type="password" name="password" placeholder="Password (min 6, 1 capital, 1 number)" required minLength={6} pattern="(?=.*[A-Z])(?=.*\d).*" />
            <button className="button" type="submit">Create Account</button>
          </form>
        )}

        <div className="switch">
          {mode === "login" ? (
            <p> Don't have an account?
              <span onClick={() => { setError(""); setMode("register"); }}> Register</span>
            </p>
          ) : (
            <p> Already registered?
              <span onClick={() => { setError(""); setMode("login"); }}> Login</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
