import React, { useState } from "react";
import { signupApi } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import "../styles/auth.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await signupApi(form.name, form.email, form.password);
      setToken(data.token);
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">📝 Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            type="text"
            className="auth-input"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            type="email"
            className="auth-input"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            className="auth-input"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
