import React, { createContext, useState, useContext } from "react";
import { socket } from "../api/socket";
import { jwtDecode } from "jwt-decode";  // ✅ fixed named import

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface JwtPayload {
  id: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
      setTokenState(token);

      try {
        const { id } = jwtDecode<JwtPayload>(token); // ✅ now works
        socket.connect();
        socket.emit("register", id);
        console.log("🔗 Socket registered for user:", id);
      } catch (error) {
        console.error("❌ Failed to decode token:", error);
      }
    } else {
      localStorage.removeItem("token");
      setTokenState(null);
      socket.disconnect();
      console.log("🔌 Socket disconnected (logout)");
    }
  };

  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
