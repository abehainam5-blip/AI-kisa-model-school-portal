import React, { createContext, useContext, useEffect, useState } from "react";
import { TEACHER_NAME, TEACHER_CLASSES } from "../constants/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("ai-kisa-session") || "null");
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (session) sessionStorage.setItem("ai-kisa-session", JSON.stringify(session));
    else sessionStorage.removeItem("ai-kisa-session");
  }, [session]);

  const login = async (email, password) => {
    const response = await fetch("/backend/api/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || !payload.success) {
      throw new Error(payload.error || "Unable to sign in.");
    }
    setSession(payload.data);
    return payload.data.user;
  };

  const logout = () => {
    setSession(null);
  };

  const user = session?.user;
  const role = user?.role || null;
  const currentUser = role === "teacher"
    ? {
        id: user.id,
        name: user.name || TEACHER_NAME,
        initials: (user.name || TEACHER_NAME).split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
        role: "teacher",
        roleLabel: "Teacher",
        subject: "English & Digital Media",
        classes: TEACHER_CLASSES,
        email: user.email
      }
    : role === "admin"
    ? {
        id: user.id,
      name: user.name || "Abeha Inam",
      initials: (user.name || "Abeha Inam").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase(),
        role: "admin",
        roleLabel: "Super Admin",
        subject: "School Administration & Development",
        classes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        email: user.email
      }
    : null;

  return (
    <AuthContext.Provider value={{ role, currentUser, token: session?.token || null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
