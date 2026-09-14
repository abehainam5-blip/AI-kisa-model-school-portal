import React, { useState } from "react";
import { ChevronRight, Sparkles } from "lucide-react";
import { LOGO_SRC } from "../../constants/logo";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("areeba.nadeem@aikisa.edu.pk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    try {
      const user = await login(email.trim(), password);
      showToast(`Welcome to AI KISA ${user.role === "admin" ? "Super Admin Portal" : "Teacher Portal"}!`, "success");
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in.");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo-ring">
          <img src={LOGO_SRC} alt="AI KISA Model School" />
        </div>
        <div className="login-title">AI KISA Model School</div>
        <div className="login-sub">Sign in to the AI Teacher Management System</div>

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
              placeholder="Your password"
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
            Sign in to Portal{" "}
            <ChevronRight size={15} />
          </button>
        </form>

        <div className="empty-note" style={{ marginTop: 18, marginBottom: 0 }}>
          <Sparkles size={15} />
          <div>
            Your database role determines the portal access granted after authentication.
          </div>
        </div>
      </div>
    </div>
  );
}
