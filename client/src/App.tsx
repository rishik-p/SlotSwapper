import React from "react";
import { useAuth } from "./context/authContext";
import Header from "./components/Header";
import { Link } from "react-router-dom";
import "./styles/style.css";

const App: React.FC = () => {
  const { token, logout } = useAuth();

  return (
    <div className="app-landing">
      <Header />

      <div className="landing-hero">
        <div className="landing-content">
          <h1 className="landing-title">SlotSwapper</h1>
          <p className="landing-subtitle">
            Swap time slots easily. Coordinate schedules effortlessly.
          </p>

          {token ? (
            <>
              <p className="welcome-message">You're logged in 🎉</p>
              <div className="landing-buttons">
                <Link to="/dashboard" className="primary-btn">Go to Dashboard</Link>
                <button className="logout-btn" onClick={logout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="landing-buttons">
              <Link to="/login" className="primary-btn">Login</Link>
              <Link to="/signup" className="secondary-btn">Sign Up</Link>
            </div>
          )}
        </div>

        <div className="landing-illustration">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9076/9076532.png"
            alt="Calendar Illustration"
          />
        </div>
      </div>
    </div>
  );
};

export default App;
