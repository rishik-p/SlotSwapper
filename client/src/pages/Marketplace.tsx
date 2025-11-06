// Marketplace.tsx
import React, { useEffect, useState } from "react";
import { getSwappableSlots, sendSwapRequest } from "../api/swaps";
import { getMyEvents } from "../api/events";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { socket } from "../api/socket";
import "../styles/Marketplace.css";

const Marketplace: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [slots, setSlots] = useState<any[]>([]);
  const [mySlots, setMySlots] = useState<any[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<string>("");

  useEffect(() => {
    if (!token) navigate("/login");
    else {
      loadSlots();
      loadMySwappable();
    }
  }, [token]);


  useEffect(() => {
    socket.on("swap:accepted", () => {
      toast.success("✅ A swap was completed! Updating slots...");
      loadSlots();
      loadMySwappable();
    });

    socket.on("swap:new", () => {
      loadSlots();
    });

    return () => {
      socket.off("swap:accepted");
      socket.off("swap:new");
    };
  }, []);

  const loadSlots = async () => {
    try {
      const data = await getSwappableSlots();
      setSlots(data.swappable);
    } catch {
      toast.error("Failed to load marketplace slots");
    }
  };

  const loadMySwappable = async () => {
    try {
      const data = await getMyEvents();
      setMySlots(data.filter((e: any) => e.status === "SWAPPABLE"));
    } catch {
      toast.error("Failed to load your swappable slots");
    }
  };

  const handleSwapRequest = async (theirSlotId: string) => {
    if (!selectedOffer) return toast.error("Select one of your slots first");

    try {
      await sendSwapRequest(selectedOffer, theirSlotId);
      toast.success("✅ Swap request sent!");

      // refresh UI automatically
      loadSlots();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send request");
    }
  };

  return (
    <div className="market-container">
      <h2> Swappable Slots Marketplace</h2>

      <div className="select-box">
        <label>Select one of your swappable slots:</label>
        <select value={selectedOffer} onChange={(e) => setSelectedOffer(e.target.value)}>
          <option value="">-- choose your slot --</option>
          {mySlots.map((s) => (
            <option key={s._id} value={s._id}>
              {s.title} ({new Date(s.startTime).toLocaleString()})
            </option>
          ))}
        </select>
      </div>

      <h3>Available Slots</h3>

      {slots.length === 0 ? (
        <p className="empty-msg">No slots available right now.</p>
      ) : (
        <div className="slots-grid">
          {slots.map((slot) => (
            <div className="slot-card" key={slot._id}>
              <h4>{slot.title}</h4>
              <p>
                {new Date(slot.startTime).toLocaleString()} →{" "}
                {new Date(slot.endTime).toLocaleString()}
              </p>
              <p className="slot-owner">
                Owner: {slot.userId.name} ({slot.userId.email})
              </p>
              <button onClick={() => handleSwapRequest(slot._id)}>Request Swap</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
