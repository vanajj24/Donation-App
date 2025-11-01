import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/dashboard"; // hide on dashboard

  if (hideNavbar) return null; // hide navbar after login

  return (
    <nav className="navbar">
      <div className="navbar-logo">DonationHub</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
