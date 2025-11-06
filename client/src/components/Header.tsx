import { useAuth } from "../context/authContext";

export default function Header() {
  const { token, logout } = useAuth();

  return (
    <div className="navbar">
      Slot Swapper
      {token && (
        <button
          style={{
            float: "right",
            background: "white",
            color: "#2563eb",
            padding: "6px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer"
          }}
          onClick={logout}
        >
          Logout
        </button>
      )}
    </div>
  );
}
