import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";

const getAuthHeader = () => ({
  headers: {
    Authorization: "Bearer " + localStorage.getItem("token"),
  },
});

export const getSwappableSlots = async () => {
  const res = await axios.get(`${API_BASE}/swappable`, getAuthHeader());
  return res.data;
};

export const sendSwapRequest = async (mySlotId: string, theirSlotId: string) => {
  const res = await axios.post(
    `${API_BASE}/swap-request`,
    { mySlotId, theirSlotId },
    getAuthHeader()
  );
  return res.data;
};

export const getSwapRequests = async () => {
  const res = await axios.get(`${API_BASE}/swap-requests`, getAuthHeader());
  return res.data;
};

export const respondToSwap = async (id: string, accepted: boolean) => {
  const res = await axios.post(`${API_BASE}/swap-response/${id}`, { accepted }, getAuthHeader());
  return res.data;
};
