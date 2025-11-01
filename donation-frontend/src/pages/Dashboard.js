import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 1. Import axios

const FaUserCircle = () => <span>&#128100;</span>; // User emoji
const FaUtensils = () => <span>&#127869;</span>; // Fork and Knife emoji
const FaBook = () => <span>&#128218;</span>; // Book emoji
const FaMoneyBillWave = () => <span>&#128182;</span>; // Money emoji
const FaTshirt = () => <span>&#128085;</span>; // T-shirt emoji
const FaClinicMedical = () => <span>&#10010;</span>; // Cross
const FaGraduationCap = () => <span>&#127891;</span>; // Grad Cap emoji
const FaPlusCircle = () => <span>&#10133;</span>; // Plus emoji

// --- API Endpoint ---
const API = "https://donation-app-r9dp.onrender.com/api";

// --- Embedded CSS Styles (Cleaned) ---
const DashboardStyles = () => (
  <style>
    {`
.dashboard-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  font-family: "Poppins", sans-serif;
  padding: 30px;
}

/* GLASS EFFECT */
.glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 15px;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.15);
}

/* HEADER */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  border: 2px solid #2e86de;
  border-radius: 15px;
  margin-bottom: 25px;
}

.dashboard-header h1 {
  color: #2e86de;
  font-size: 26px;
  font-weight: 700;
}

/* PROFILE SECTION */
.profile-section {
  position: relative;
  display: flex;
  align-items: center;
  z-index: 100;
}

.profile-icon {
  color: #2e86de;
  cursor: pointer;
}

.profile-side {
  position: absolute;
  right: 45px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #2e86de;
  border-radius: 10px;
  padding: 15px;
  width: 180px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
  z-index: 200;
  pointer-events: auto;
}

.profile-side p {
  margin: 8px 0;
  color: #333;
  font-size: 16px;
}

.profile-side button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;
  font-weight: 600;
  transition: 0.3s;
}

.profile-side button:hover {
  background-color: #c0392b;
}

/* FILTERS */
.filters {
  padding: 20px;
  text-align: center;
  margin-bottom: 25px;
}

.filters h3 {
  color: #2e86de;
  margin-bottom: 10px;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.filter-btn {
  background: white;
  border: 2px solid #2e86de;
  color: #2e86de;
  padding: 8px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.filter-btn.active,
.filter-btn:hover {
  background-color: #2e86de;
  color: white;
}

/* DONATION TYPES */
.donation-types {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.donation-type-card {
  width: 120px;
  height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: 0.3s;
}

.donation-type-card.active-type,
.donation-type-card:hover {
  border: 2px solid #2e86de;
  transform: scale(1.05);
}

.donation-type-card p {
  margin-top: 10px;
  font-weight: 600;
  color: #333;
}

/* ADD DONATION BUTTON */
.add-donation {
  text-align: center;
  margin-bottom: 25px;
}

.add-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: 0.3s;
}

.add-btn:hover {
  background-color: #1e8449;
}

/* ADD DONATION FORM */
.donation-form {
  max-width: 450px;
  margin: 0 auto 30px auto;
}

/* Re-using form-group from Login page styles if available, */
/* but defining here to be safe */
.donation-form .form-group {
  margin-bottom: 15px;
}

.donation-form .form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
}

.donation-form .form-group input,
.donation-form .form-group select,
.donation-form .form-group textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-family: "Poppins", sans-serif;
}

.donation-form .form-group textarea {
  resize: none;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  background-color: #2e86de;
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: 0.3s;
}

.submit-btn:hover {
  background-color: #1b4f72;
}

/* DETAILS TABLE */
.details-section {
  padding: 25px;
  margin-bottom: 30px;
  overflow-x: auto;
}

.details-section h3 {
  text-align: center;
  color: #2e86de;
  margin-bottom: 15px;
}

.details-section table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.details-section th,
.details-section td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.details-section th {
  background-color: #2e86de;
  color: white;
}
    `}
  </style>
);

function Dashboard() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("All");
  const [selectedType, setSelectedType] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userName, setUserName] = useState("User"); // State for user's name
  const [newDonation, setNewDonation] = useState({
    type: "",
    name: "",
    description: "",
    price: "",
    quantity: "",
    date: "",
    location: "",
    contact: "",
  });

  const profileRef = useRef();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 4. Update Logout function
  const handleLogout = () => {
    localStorage.clear();
    // Clear the token from axios defaults
    delete axios.defaults.headers.common["Authorization"];
    // Navigate to /login (since / is protected)
    navigate("/login");
  };

  // 2. Fetch User Data and Donations from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data to get name
        const userRes = await axios.get(`${API}/dashboard`);
        setUserName(userRes.data.userData.name);

        // Fetch donations
        // NOTE: You will need to create this GET /api/donations endpoint on your backend
        const donationRes = await axios.get(`${API}/donations`);
        setDonations(donationRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        // If token is invalid or expired, log the user out
        if (err.response && err.response.status === 401) {
          handleLogout();
        }
      }
    };

    fetchData();
    // We are deliberately leaving handleLogout out of dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const donationIcons = {
    Food: <FaUtensils color="#e67e22" />,
    Books: <FaBook color="#2980b9" />,
    Money: <FaMoneyBillWave color="#27ae60" />,
    Clothes: <FaTshirt color="#8e44ad" />,
    Medical: <FaClinicMedical color="#c0392b" />,
    Education: <FaGraduationCap color="#16a085" />,
  };

  // Filter donations by time
  const filteredDonations =
    filter === "All"
      ? donations
      : donations.filter((d) => {
          const date = new Date(d.date);
          const now = new Date();
          const diffDays = (now - date) / (1000 * 60 * 60 * 24);
          if (filter === "Weekly") return diffDays <= 7;
          if (filter === "Monthly") return diffDays <= 30;
          if (filter === "Yearly") return diffDays <= 365;
          return true;
        });

  // 3. Add new donation (to backend)
  const handleAddDonation = async (e) => {
    e.preventDefault();
    const { type, name, description, price, quantity, date, location, contact } =
      newDonation;

    if (
      !type ||
      !name ||
      !description ||
      !price ||
      !quantity ||
      !date ||
      !location ||
      !contact
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      // NOTE: You will need to create this POST /api/donations endpoint on your backend
      const res = await axios.post(`${API}/donations`, newDonation);

      // Add the new donation (returned from API) to the state
      setDonations([...donations, res.data]);
      setNewDonation({
        type: "",
        name: "",
        description: "",
        price: "",
        quantity: "",
        date: "",
        location: "",
        contact: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding donation:", err);
      alert(err.response?.data?.message || "Failed to add donation.");
    }
  };

  return (
    <>
      <DashboardStyles />
      <div className="dashboard-page">
        {/* HEADER */}
        <header className="dashboard-header glass">
          <h1>Donation Dashboard</h1>
          <div className="profile-section" ref={profileRef}>
            <FaUserCircle
              size={35}
              className="profile-icon"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="profile-side glass">
                <p>
                  {/* 5. Display dynamic user name */}
                  <strong>User:</strong> {userName}
                </p>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </header>

        {/* FILTERS */}
        <div className="filters glass">
          <h3>View Donations</h3>
          <div className="filter-buttons">
            {["All", "Weekly", "Monthly", "Yearly"].map((f) => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* DONATION TYPES */}
        <div className="donation-types">
          {Object.keys(donationIcons).map((type) => (
            <div
              key={type}
              className={`donation-type-card glass ${
                selectedType === type ? "active-type" : ""
              }`}
              onClick={() => setSelectedType(type)}
            >
              {donationIcons[type]}
              <p>{type}</p>
            </div>
          ))}
        </div>

        {/* ADD DONATION BUTTON */}
        <div className="add-donation">
          <button
            className="add-btn"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <FaPlusCircle /> {showAddForm ? "Cancel" : "Add Donation"}
          </button>
        </div>

        {/* ADD DONATION FORM */}
        {showAddForm && (
          <div className="donation-form glass">
            <h3>Add New Donation</h3>
            <form onSubmit={handleAddDonation}>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={newDonation.type}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, type: e.target.value })
                  }
                  required
                >
                  <option value="">--Select Type--</option>
                  {Object.keys(donationIcons).map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Donation Name</label>
                <input
                  type="text"
                  value={newDonation.name}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={newDonation.description}
                  onChange={(e) =>
                    setNewDonation({
                      ...newDonation,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  value={newDonation.price}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={newDonation.quantity}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, quantity: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newDonation.date}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={newDonation.location}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, location: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="tel"
                  value={newDonation.contact}
                  onChange={(e) =>
                    setNewDonation({ ...newDonation, contact: e.target.value })
                  }
                  required
                />
              </div>

              <button type="submit" className="submit-btn">
                Save Donation
              </button>
            </form>
          </div>
        )}

        {/* DETAILS TABLE */}
        {selectedType && (
          <div className="details-section glass">
            <h3>{selectedType} Donations</h3>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price (₹)</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations
                  .filter((d) => d.type === selectedType)
                  .map((d, i) => (
                    <tr key={i}>
                      <td>{d.type}</td>
                      <td>{d.name}</td>
                      <td>{d.description}</td>
                      <td>{d.price}</td>
                      <td>{d.quantity}</td>
                      <td>{d.date}</td>
                      <td>{d.location}</td>
                      <td>{d.contact}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;

