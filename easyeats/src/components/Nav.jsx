import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegLogin from "./RegLogin";
import "../styles/Navbar.css";

export default function Navbar() {
  const [show, setShow] = useState(true);
  const [lastY, setLastY] = useState(0);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setShow(currentY < lastY || currentY < 10);
      setLastY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastY]);

const logout = () => {
  localStorage.removeItem("user");
  setUser(null);
  navigate("/home");
};


  return (
    <>
      <nav className={`navbar ${show ? "show" : "hide"}`}>
        
        <h1 className="logo" onClick={() => navigate("/home")}>EasyEats</h1>

        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/makerecipe">Make Recipe</Link>
          <Link to="/profile">Profile</Link>
        </div>

{user ? (
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <span style={{ fontSize: "16px", color: "#333" }}>Hi, {user.username}</span>
    <button className="nav-btn" onClick={logout}>Logout</button>
  </div>
) : (
  <button className="nav-btn" onClick={() => setShowPopup(true)}>Login</button>
)}
      </nav>

      {showPopup && (
        <RegLogin
          onLogin={() => { setUser(JSON.parse(localStorage.getItem("user"))); setShowPopup(false); }}
          close={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
