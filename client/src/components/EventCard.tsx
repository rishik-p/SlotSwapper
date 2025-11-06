import React from "react";
import "../styles/eventCard.css";

interface EventCardProps {
  event: any;
  onMakeSwappable: (id: string) => void;
  onMakeBusy: (id: string) => void;
  onDelete: (id: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onMakeSwappable, onMakeBusy, onDelete }) => {
  const { _id, title, startTime, endTime, status } = event;

  return (
    <div className="event-card">
      <div className="event-header">
        <h3>{title}</h3>
        <span className={`status-badge ${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <p className="event-time">
        {new Date(startTime).toLocaleString()} → {new Date(endTime).toLocaleString()}
      </p>

      <div className="event-actions">
        {status === "BUSY" && (
          <button className="swap-btn" onClick={() => onMakeSwappable(_id)}>
            Make Swappable
          </button>
        )}

        {status === "SWAPPABLE" && (
          <button className="busy-btn" onClick={() => onMakeBusy(_id)}>
            Make Busy
          </button>
        )}

        <button className="delete-btn" onClick={() => onDelete(_id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;
