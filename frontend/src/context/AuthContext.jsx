import { createContext, useContext, useState, useCallback } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("jt_token"));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("jt_user");
    return raw ? JSON.parse(raw) : null;
  });

  const persist = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("jt_token", nextToken);
    localStorage.setItem("jt_user", JSON.stringify(nextUser));
  };

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    persist(data.token, data.user);
  }, []);

  const register = useCallback(async (email, password) => {
    const data = await api.register(email, password);
    persist(data.token, data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("jt_token");
    localStorage.removeItem("jt_user");
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
