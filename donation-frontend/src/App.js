import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import axios from "axios";

// --- Authentication Check ---
// This code should run when your app first loads
// It checks if a token exists and sets the default axios header
const token = localStorage.getItem("token");
if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// --- Protected Route Component ---
// This component checks if a user is logged in.
// If they are, it renders the page they requested.
// If not, it redirects them to the /login page.
const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  // You could add token validation logic here if needed

  if (token) {
    // User is authenticated, render the requested element
    return element;
  } else {
    // User is not authenticated, redirect to login
    // 'replace' stops the user from using the back button to return to the protected page
    return <Navigate to="/login" replace />;
  }
};

// --- Public-Only Route Component ---
// This component is for pages like Login and Signup.
// If a user is already logged in, it redirects them to the dashboard.
// This prevents a logged-in user from seeing the login page again.
const PublicOnlyRoute = ({ element }) => {
  const token = localStorage.getItem("token");

  if (token) {
    // User is authenticated, redirect them away from the login page
    return <Navigate to="/dashboard" replace />;
  } else {
    // User is not authenticated, show them the login/signup page
    return element;
  }
};


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* --- Public-Only Routes --- */}
        {/* These routes are only accessible if the user is NOT logged in */}
        <Route
          path="/login"
          element={<PublicOnlyRoute element={<Login />} />}
        />
        
        {/* --- Protected Routes --- */}
        {/* These routes are only accessible if the user IS logged in */}
        <Route
          path="/"
          element={<ProtectedRoute element={<Home />} />}
        />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} />}
        />

        {/* You could also add a 404 "Not Found" route:
          <Route path="*" element={<div>Page Not Found</div>} />
        */}
      </Routes>
    </Router>
  );
}

export default App;



