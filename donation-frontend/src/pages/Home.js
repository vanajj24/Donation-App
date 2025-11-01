import React from "react";
import { Link } from "react-router-dom"; // <- import Link
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Join Hands to Make a Change</h1>
          <p>
            Together we can bring hope to those in need. Every contribution counts —
            be it food, money, education, or care.
          </p>
          {/* Use Link to navigate to login page */}
          <Link to="/login" className="donate-btn">
            Start Donating
          </Link>
        </div>
      </section>

      {/* Footer Donation Section */}
      <footer className="footer-section">
        <h2>Choose What You Want to Donate</h2>
        <div className="footer-buttons">
          <button className="donation-btn">Food</button>
          <button className="donation-btn">Money</button>
          <button className="donation-btn">Books</button>
          <button className="donation-btn">Education</button>
          <button className="donation-btn">Medical</button>
          <button className="donation-btn">Clothes</button>
          <button className="donation-btn">Others</button>
        </div>
        <p className="footer-text">
          “Small acts, when multiplied by millions of people, can transform the world.”
        </p>
      </footer>
    </div>
  );
}

export default Home;



