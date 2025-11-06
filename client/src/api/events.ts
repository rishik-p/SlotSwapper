import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

const getAuthHeader = () => ({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export const getMyEvents = async () => {
  const res = await axios.get(`${API_BASE}/events/my`, getAuthHeader());
  return res.data;
};

export const createEvent = async (title: string, startTime: string, endTime: string) => {
  const res = await axios.post(`${API_BASE}/events`, { title, startTime, endTime }, getAuthHeader());
  return res.data;
};

export const updateEventStatus = async (id: string, status: string) => {
  const res = await axios.put(`${API_BASE}/events/${id}`, { status }, getAuthHeader());
  return res.data;
};

export const deleteEvent = async (id: string) => {
  const res = await axios.delete(`${API_BASE}/events/${id}`, getAuthHeader());
  return res.data;
};
