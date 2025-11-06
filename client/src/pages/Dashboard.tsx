import React, { useEffect, useState } from "react";
import {
  getMyEvents,
  createEvent,
  updateEventStatus,
  deleteEvent,
} from "../api/events";
import EventCard from "../components/EventCard";
import { useAuth } from "../context/authContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../api/socket";
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", startTime: "", endTime: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) navigate("/login");
    else loadEvents();
  }, [token]);

  useEffect(() => {
    socket.on("swap:new", () => toast("📨 New swap request received!"));
    socket.on("swap:accepted", () => {
      toast.success("✅ Your swap request was accepted!");
      loadEvents();
    });
    socket.on("swap:rejected", () => toast.error("❌ Your swap request was rejected."));

    return () => {
      socket.off("swap:new");
      socket.off("swap:accepted");
      socket.off("swap:rejected");
    };
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getMyEvents();
      setEvents(data);
    } catch {
      setError("Could not load events");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEvent(form.title, form.startTime, form.endTime);
      setForm({ title: "", startTime: "", endTime: "" });
      toast.success("Event created!");
      loadEvents();
    } catch {
      toast.error("Failed to create event");
      setError("Failed to create event");
    }
  };

  const handleMakeSwappable = async (id: string) => {
    await updateEventStatus(id, "SWAPPABLE");
    toast.success("Marked as SWAPPABLE");
    loadEvents();
  };

  const handleMakeBusy = async (id: string) => {
    await updateEventStatus(id, "BUSY");
    toast.success("Marked as BUSY");
    loadEvents();
  };

  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    toast.success("Event deleted");
    loadEvents();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>📅 My Calendar</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className="nav-links">
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/requests">Swap Requests</Link>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="form-card">
        <h3>Create Event</h3>

        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Event Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="datetime-local"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />

          <input
            type="datetime-local"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />

          <button type="submit" className="primary-btn">Add Event</button>
        </form>
      </div>

      <h3 className="events-title">My Events</h3>

      <div className="events-grid">
        {events.length === 0 ? (
          <p className="no-events">No events yet.</p>
        ) : (
          events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              onMakeSwappable={handleMakeSwappable}
              onMakeBusy={handleMakeBusy}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default Dashboard;
