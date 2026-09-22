/**
 * Auth API client with automatic fallback to mock authentication.
 *
 * LOCKDOWN MODE (isolated testing):
 *   Only ONE account is active: rizvitabssum123@gmail.com
 *   Password: kisaschool123!
 *
 * When the PHP/PostgreSQL backend is unreachable, the client transparently
 * falls back to a local mock login so the frontend can still be tested.
 */

const DEFAULT_API_BASES = [
  "http://localhost/backend",
  "http://127.0.0.1/backend",
  "http://localhost:8000/backend",
  "http://127.0.0.1:8000/backend",
  "http://localhost:8080/backend",
  "http://127.0.0.1:8080/backend",
];

// LOCKDOWN: single testing account.
const LOCKDOWN_MODE = true;
const FALLBACK_MASTER_PASSWORD = "kisaschool123!";
const FALLBACK_USERS = [
  { id: 1, name: "Rizvi Tabssum", email: "rizvitabssum123@gmail.com", role: "teacher" },
];

function normalizeBase(base) {
  if (!base) return "";
  return String(base).trim().replace(/\/+$/, "");
}

function getApiCandidates() {
  const envBase = normalizeBase(
    (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_BASE_URL)
      ? import.meta.env.VITE_API_BASE_URL
      : (typeof window !== "undefined" ? window.__AIKISA_API_BASE_URL__ || "" : "")
  );

  const candidates = envBase ? [envBase] : [];
  DEFAULT_API_BASES.forEach((base) => {
    if (!candidates.includes(base)) candidates.push(base);
  });

  return candidates;
}

function buildLoginUrl(base) {
  return new URL("api/login.php", `${normalizeBase(base)}/`).toString();
}

/**
 * Attempt login against the PHP backend.
 * Falls back to mock authentication when every candidate is unreachable.
 */
export async function loginWithEmail(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const lastErrors = [];

  // LOCKDOWN: reject any email that is not the active testing account.
  if (LOCKDOWN_MODE && normalizedEmail !== "rizvitabssum123@gmail.com") {
    throw new Error("Account access is temporarily restricted during isolated testing.");
  }

  // Try the real backend first.
  for (const base of getApiCandidates()) {
    try {
      const response = await fetch(buildLoginUrl(base), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const payload = await response.json().catch(() => ({}));

      if (response.ok && payload.success) {
        return payload.data;
      }

      if (payload.error) {
        lastErrors.push(new Error(payload.error));
        if (response.status === 401 || response.status === 422) {
          throw new Error(payload.error);
        }
        continue;
      }

      lastErrors.push(new Error("Login request failed."));
    } catch (error) {
      lastErrors.push(error);
    }
  }

  // Fallback: mock authentication for local testing.
  const mockUser = FALLBACK_USERS.find(
    (user) => user.email.toLowerCase() === normalizedEmail
  );

  if (mockUser && password === FALLBACK_MASTER_PASSWORD) {
    return {
      token: `mock-token-${mockUser.id}`,
      user: {
        ...mockUser,
        created_at: new Date().toISOString(),
      },
      _fallback: true,
    };
  }

  const lastError = lastErrors[lastErrors.length - 1];
  const message = lastError?.message || "Login API unavailable.";

  if (message.includes("Invalid email or password")) {
    throw new Error(message);
  }

  throw new Error(
    "Login API unavailable. Start the PHP backend locally or configure VITE_API_BASE_URL."
  );
}

/**
 * Check whether the backend is currently reachable.
 */
export async function checkBackendHealth() {
  for (const base of getApiCandidates()) {
    try {
      const response = await fetch(buildLoginUrl(base), {
        method: "OPTIONS",
        credentials: "include",
      });
      if (response.status === 204 || response.ok) {
        return { online: true, base };
      }
    } catch {
      continue;
    }
  }
  return { online: false, base: null };
}