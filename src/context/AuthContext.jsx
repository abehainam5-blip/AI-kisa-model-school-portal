import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null); // null | 'teacher' | 'super_admin'
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Try to fetch current user if token present in sessionStorage
    const saved = sessionStorage.getItem('aikisa_token');
    if (saved) {
      setToken(saved);
      fetchCurrentUser(saved);
    }
  }, []);

  const fetchCurrentUser = async (t) => {
    try {
      const res = await fetch('/backend/api/current_user.php', {
        headers: { Authorization: `Bearer ${t}` },
        credentials: 'include'
      });
      const json = await res.json();
      if (json.success && json.data && json.data.user) {
        const u = json.data.user;
        setUser(u);
        setRole(u.role === 'super_admin' ? 'super_admin' : 'teacher');
      } else {
        setUser(null); setRole(null); setToken(null); sessionStorage.removeItem('aikisa_token');
      }
    } catch (e) {
      console.error('Failed to fetch current user', e);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/backend/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success && json.data) {
        const t = json.data.token;
        sessionStorage.setItem('aikisa_token', t);
        setToken(t);
        setUser(json.data.user);
        setRole(json.data.user.role === 'super_admin' ? 'super_admin' : 'teacher');
        return { success: true };
      }
      return { success: false, error: json.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'The login service is currently unavailable. Please try again.' };
    }
  };

  const logout = async () => {
    await fetch('/backend/api/logout.php', { method: 'POST', credentials: 'include' });
    sessionStorage.removeItem('aikisa_token');
    setToken(null); setUser(null); setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, user, token, login, logout, setRole }}>
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
