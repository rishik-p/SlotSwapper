import React, { useEffect, useState } from "react";
import { getSwapRequests, respondToSwap } from "../api/swaps";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../styles/requests.css";

const Requests: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) navigate("/login");
    else loadRequests();
  }, [token]);

  const loadRequests = async () => {
    try {
      const data = await getSwapRequests();
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
    } catch {
      setError("Failed to load swap requests");
    }
  };

  const handleResponse = async (id: string, accepted: boolean) => {
    try {
      const res = await respondToSwap(id, accepted);
      toast.success(res.message);
      loadRequests();
    } catch (err: any) {
      setError(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="page-container">
      <h2 className="title"> Swap Requests</h2>
      {error && <p className="error-text">{error}</p>}

      <section>
        <h3 className="section-title">Incoming Requests</h3>
        {incoming.length === 0 && <p className="empty">No incoming requests.</p>}

        {incoming.map((req) => (
          <div key={req._id} className="card">
            <p><strong>From:</strong> {req.requesterId.name} ({req.requesterId.email})</p>
            <p><strong>Their Slot:</strong> {req.requesterSlotId.title}</p>
            <p><strong>Your Slot:</strong> {req.receiverSlotId.title}</p>
            <p><strong>Status:</strong> {req.status}</p>

            {req.status === "PENDING" && (
              <div className="buttons-row">
                <button className="accept-btn" onClick={() => handleResponse(req._id, true)}>Accept</button>
                <button className="reject-btn" onClick={() => handleResponse(req._id, false)}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </section>

      <section>
        <h3 className="section-title">Outgoing Requests</h3>
        {outgoing.length === 0 && <p className="empty">No outgoing requests.</p>}

        {outgoing.map((req) => (
          <div key={req._id} className="card">
            <p><strong>To:</strong> {req.receiverId.name} ({req.receiverId.email})</p>
            <p><strong>Your Slot:</strong> {req.requesterSlotId.title}</p>
            <p><strong>Their Slot:</strong> {req.receiverSlotId.title}</p>
            <p><strong>Status:</strong> {req.status}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Requests;
