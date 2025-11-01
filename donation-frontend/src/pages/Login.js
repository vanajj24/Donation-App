import React, { useState } from "react";
import axios from "axios";
// import "./Login.css"; // This import is no longer needed
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate

// --- Embedded CSS Styles ---
// We create a component that renders a <style> tag with all the CSS.
const LoginStyles = () => (
  <style>
    {`
/* Login.css */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  font-family: "Poppins", sans-serif;
}

.login-card {
  background-color: white;
  padding: 40px 50px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 400px;
  max-width: 90%;
  text-align: center;
  transition: 0.4s ease-in-out;
}

.login-card h2 {
  color: #2e86de;
  margin-bottom: 10px;
  font-size: 30px;
}

.login-subtitle {
  color: #555;
  font-size: 15px;
  margin-bottom: 30px;
}

.form-group {
  text-align: left;
  margin-bottom: 20px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: 0.3s;
  font-size: 15px;
}

.form-group input:focus {
  border-color: #2e86de;
  box-shadow: 0 0 4px rgba(46, 134, 222, 0.4);
}

.login-btn {
  width: 100%;
  background-color: #2e86de;
  color: white;
  border: none;
  padding: 14px 0;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s ease;
}

.login-btn:hover {
  background-color: #1e5fa4;
  transform: translateY(-2px);
}

.signup-link {
  margin-top: 20px;
  color: #333;
  font-size: 15px;
}

.toggle-btn {
  background: none;
  border: none;
  color: #2e86de;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.toggle-btn:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 500px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-card h2 {
    font-size: 26px;
  }
}
    `}
  </style>
);
// -------------------------

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
    <>
      <LoginStyles /> {/* We add the styles here */}
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
                placeholder={
                  isLogin ? "Enter your password" : "Create a password"
                }
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
                <button
                  className="toggle-btn"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  className="toggle-btn"
                  onClick={() => setIsLogin(true)}
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginSignup;

