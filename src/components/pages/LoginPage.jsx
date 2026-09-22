import React, { useState, useEffect } from "react";
import { ChevronRight, Sparkles, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { LOGO_SRC } from "../../constants/logo";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { checkBackendHealth } from "../../api/auth";

// LOCKDOWN MODE (isolated testing): only ONE account is active.
const LOCKDOWN_EMAIL = "rizvitabssum123@gmail.com";
const LOCKDOWN_PASSWORD = "kisaschool123!";

export function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState(LOCKDOWN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(true);

  useEffect(() => {
    let mounted = true;
    setCheckingHealth(true);
    checkBackendHealth()
      .then((result) => {
        if (mounted) setBackendOnline(result.online);
      })
      .catch(() => {
        if (mounted) setBackendOnline(false);
      })
      .finally(() => {
        if (mounted) setCheckingHealth(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your account email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your account password.");
      return;
    }
    if (trimmedEmail.toLowerCase() !== LOCKDOWN_EMAIL.toLowerCase()) {
      setError("Account access is temporarily restricted during isolated testing.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const user = await login(trimmedEmail, password);
      showToast(
        `Welcome to AI KISA ${user.role === "admin" ? "Super Admin Portal" : "Teacher Portal"}!`,
        "success"
      );
    } catch (loginError) {
      const message = loginError.message || "Unable to sign in.";
      setError(message);
      if (message.toLowerCase().includes("unavailable") || message.toLowerCase().includes("fallback")) {
        showToast("Backend unreachable — using local fallback authentication.", "info");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickFill = () => {
    setEmail(LOCKDOWN_EMAIL);
    setPassword(LOCKDOWN_PASSWORD);
    setError("");
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo-ring">
          <img src={LOGO_SRC} alt="AI KISA Model School" />
        </div>
        <div className="login-title">AI KISA Model School</div>
        <div className="login-sub">Sign in to the AI Teacher Management System</div>

        {/* Lockdown banner */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(245,158,11,0.12)",
            color: "var(--gold)",
            fontSize: 11.5,
            marginBottom: 14,
            border: "1px solid rgba(245,158,11,0.25)",
          }}
        >
          <Lock size={14} /> Isolated testing mode — only the designated teacher account is active.
        </div>

        {/* Backend status indicator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: backendOnline
              ? "rgba(34,197,94,0.12)"
              : "rgba(245,158,11,0.12)",
            color: backendOnline ? "var(--success)" : "var(--gold)",
            fontSize: 11.5,
            marginBottom: 14,
            border: `1px solid ${backendOnline ? "rgba(34,197,94,0.25)" : "rgba(245,158,11,0.25)"}`,
          }}
        >
          {checkingHealth ? (
            <>
              <AlertCircle size={14} /> Checking backend connection…
            </>
          ) : backendOnline ? (
            <>
              <CheckCircle size={14} /> Backend connected — live authentication active.
            </>
          ) : (
            <>
              <AlertCircle size={14} /> Backend offline — fallback authentication enabled.
            </>
          )}
        </div>

        {error && (
          <div
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              background: "rgba(251,113,133,0.15)",
              color: "var(--danger)",
              fontSize: 12,
              marginBottom: 14,
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
              placeholder="rizvitabssum123@gmail.com"
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
            disabled={isSubmitting}
            style={{ width: "100%", justifyContent: "center", marginTop: 6, opacity: isSubmitting ? 0.75 : 1 }}
          >
            {isSubmitting ? "Signing in..." : "Sign in to Portal"}{" "}
            {!isSubmitting && <ChevronRight size={15} />}
          </button>
        </form>

        {/* Quick-fill preset for local testing */}
        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 11, color: "var(--text-mute)", marginBottom: 8, fontWeight: 700 }}>
            Quick-fill (local testing):
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={quickFill}
          >
            Fill Testing Credentials
          </button>
        </div>

        <div className="empty-note" style={{ marginTop: 18, marginBottom: 0 }}>
          <Sparkles size={15} />
          <div>
            Testing password: <b>{LOCKDOWN_PASSWORD}</b>.
          </div>
        </div>
      </div>
    </div>
  );
}