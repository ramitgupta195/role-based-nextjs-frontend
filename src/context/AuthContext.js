"use client";
import { createContext, useContext, useState } from "react";
import * as api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [token, setToken] = useState(null);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setRoles(data.roles);
    setToken(data.token); // save token if needed
    localStorage.setItem("token", data.token);
    return data;
  };

  const signup = async (email, password, password_confirmation) => {
    const data = await api.signup(email, password, password_confirmation);
    setUser(data.user);
    setRoles(data.roles);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    return data;
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, roles, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
