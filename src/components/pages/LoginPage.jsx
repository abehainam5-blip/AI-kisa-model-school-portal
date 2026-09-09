import React, { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { LOGO_SRC } from "../../constants/logo";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [role, setRole] = useState("teacher");
  const [email, setEmail] = useState("areeba.nadeem@aikisa.edu.pk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRoleToggle = (newRole) => {
    setRole(newRole);
    if (newRole === "teacher") {
      setEmail("areeba.nadeem@aikisa.edu.pk");
    } else {
      setEmail("admin@aikisa.edu.pk");
    }
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your academic email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your account password.");
      return;
    }

    const res = await login(email.trim(), password);
    if (res.success) {
      showToast(`Welcome to AI KISA ${role === "teacher" ? "Teacher Portal" : "Super Admin Portal"}!`, "success");
    } else {
      setError(res.error || 'Login failed');
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo-ring">
          <img src={LOGO_SRC || '/favicon.svg'} alt="AI KISA Model School" />
        </div>
        <div className="login-title">AI KISA Model School</div>
        <div className="login-sub">Sign in to the AI Teacher Management System</div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div className="toggle-pill">
            <button
              type="button"
              className={role === "teacher" ? "active" : ""}
              onClick={() => handleRoleToggle("teacher")}
            >
              Teacher
            </button>
            <button
              type="button"
              className={role === "admin" ? "active" : ""}
              onClick={() => handleRoleToggle("admin")}
            >
              Super Admin
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(251,113,133,0.15)",
              color: "var(--danger)",
              fontSize: 12,
              marginBottom: 14
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="field-group">
            <label className="field-label">Email</label>
            <input
              className="field-input"
              type="email"
              placeholder="you@aikisa.edu.pk"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
            />
          </div>
          <div className="field-group">
            <label className="field-label">Password</label>
            <input
              className="field-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 6 }}
          >
            Sign in to {role === "teacher" ? "Teacher Portal" : "Super Admin Portal"}{" "}
            <ChevronRight size={15} />
          </button>
        </form>

        <div className="empty-note" style={{ marginTop: 18, marginBottom: 0 }}>
          <Sparkles size={15} />
          <div>
            Select <b>Teacher</b> or <b>Super Admin</b> above to experience both dedicated role dashboards.
          </div>
        </div>
      </div>
    </div>
  );
}
