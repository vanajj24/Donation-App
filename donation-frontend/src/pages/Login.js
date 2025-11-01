import React, { useState } from "react";
import axios from "axios";
// import "./Login.css"; // Removed to resolve compilation error
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate(); // 2. Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- UPDATED API ENDPOINT ---
  const API = "https://donation-app-r9dp.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN REQUEST
        const res = await axios.post(`${API}/login`, {
          email: formData.email,
          password: formData.password,
        });

        // 3. Assume response has { token, user }
        const { token, user } = res.data;

        // 4. Store the token in localStorage
        localStorage.setItem("token", token);

        // 5. Set token to Axios default header for all future requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        alert(`Welcome back, ${user.name}!`);
        navigate("/dashboard"); // 6. Use navigate for client-side redirect

      } else {
        // SIGNUP REQUEST
        // Note: A common pattern is to log the user in immediately after signup.
        const res = await axios.post(`${API}/signup`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // 3. Assume signup also returns { token, user }
        const { token, user } = res.data;

        // 4. Store the token
        localStorage.setItem("token", token);

        // 5. Set token to Axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        alert(`Welcome, ${user.name}! Signup successful.`);
        navigate("/dashboard"); // 6. Redirect to dashboard
      }
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? "Welcome Back!" : "Create an Account"}</h2>
        <p className="login-subtitle">
          {isLogin
            ? "Log in to continue"
            : "Join us in making a difference"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder={isLogin ? "Enter your password" : "Create a password"}
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="signup-link">
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <button className="toggle-btn" onClick={() => setIsLogin(false)}>
                Sign up here
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="toggle-btn" onClick={() => setIsLogin(true)}>
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;

