
import React from "react";
import { useAuth } from "./context/authContext";
import { Link } from "react-router-dom";

import "./styles/style.css";

const App: React.FC = () => {
  const { token } = useAuth();

  return (
    <div className="page-container">


      <div className="center-card">
        <h1 className="page-title">SlotSwapper</h1>
        <p className="page-subtext">
          Swap time slots easily. Coordinate schedules effortlessly.
        </p>

        {token ? (
          <div className="button-group">
            <Link to="/dashboard" className="primary-btn">Go to Dashboard</Link>
          </div>
        ) : (
          <div className="button-group">
            <Link to="/login" className="primary-btn">Login</Link>
            <Link to="/signup" className="primary-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
