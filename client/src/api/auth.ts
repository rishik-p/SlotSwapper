import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

export const signupApi = async (name: string, email: string, password: string) => {

  const res = await axios.post(`${API_BASE}/auth/signup`, { name, email, password });
  return res.data;
};

export const loginApi = async (email: string, password: string) => {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  return res.data;
};
