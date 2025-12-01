import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !loading) {
      handleLogin(e);
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Left Section - Form */}
      <div style={styles.leftContainer}>
        <div style={styles.formWrapper}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Sign in to your account to continue</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div style={styles.alertError}>
              <AlertCircle size={18} style={{ color: "#d32f2f", flexShrink: 0 }} />
              <span style={{ color: "#d32f2f", fontSize: "13px", fontWeight: "500" }}>
                {error}
              </span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div style={styles.alertSuccess}>
              <CheckCircle size={18} style={{ color: "#2e7d32", flexShrink: 0 }} />
              <span style={{ color: "#2e7d32", fontSize: "13px", fontWeight: "500" }}>
                Login successful! Redirecting...
              </span>
            </div>
          )}

          {/* Form Fields */}
          <div style={styles.form}>
            {/* Email Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                disabled={loading}
              />
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={styles.passwordInput}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#6b7280" />
                  ) : (
                    <Eye size={18} color="#6b7280" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div style={styles.forgotContainer}>
              <a href="#" style={styles.forgotLink}>
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              style={{
                ...styles.submitButton,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Signup Link */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Don't have an account?{" "}
              <a href="/signup" style={styles.signupLink}>
                Create one here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Illustration */}
      <div style={styles.rightContainer}>
        <div style={styles.illustrationBox}>
          <div style={styles.illustration}>
            <div style={styles.iconCircle1}></div>
            <div style={styles.iconCircle2}></div>
            <div style={styles.iconCircle3}></div>
            <svg
              viewBox="0 0 300 300"
              style={styles.svgIllustration}
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="50" y="80" width="200" height="140" rx="10" fill="none" stroke="#0f172a" strokeWidth="2" />
              <line x1="50" y1="120" x2="250" y2="120" stroke="#0f172a" strokeWidth="2" />
              <circle cx="80" cy="100" r="4" fill="#0f172a" />
              <circle cx="90" cy="100" r="4" fill="#0f172a" />
              <circle cx="100" cy="100" r="4" fill="#0f172a" />
              <path d="M 70 150 Q 150 190 230 150" stroke="#1e40af" strokeWidth="3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <p style={styles.illustrationText}>Secure Access to Your Account</p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const styles = {
  mainContainer: {
    display: "flex",
    minHeight: "100vh",
    width: "100%",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  leftContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    backgroundColor: "#ffffff",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "420px",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: "0",
    fontWeight: "400",
  },
  alertError: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    backgroundColor: "#ffebee",
    border: "1px solid #ef5350",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  alertSuccess: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    backgroundColor: "#e8f5e9",
    border: "1px solid #66bb6a",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#1e293b",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },
  input: {
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    transition: "all 0.3s ease",
    outline: "none",
    cursor: "text",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "12px 14px 12px 14px",
    paddingRight: "40px",
    border: "1px solid #cbd5e1",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#0f172a",
    backgroundColor: "#f8fafc",
    transition: "all 0.3s ease",
    outline: "none",
    cursor: "text",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s ease",
  },
  forgotContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "-8px",
  },
  forgotLink: {
    fontSize: "13px",
    color: "#0f172a",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.2s ease",
  },
  submitButton: {
    padding: "12px 24px",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "4px",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0",
  },
  signupLink: {
    color: "#0f172a",
    fontWeight: "600",
    textDecoration: "none",
    transition: "color 0.2s ease",
  },
  rightContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    borderLeft: "1px solid #e2e8f0",
    padding: "40px",
  },
  illustrationBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "20px",
  },
  illustration: {
    position: "relative",
    width: "280px",
    height: "280px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle1: {
    position: "absolute",
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    backgroundColor: "rgba(15, 23, 42, 0.05)",
    top: "20px",
    left: "20px",
  },
  iconCircle2: {
    position: "absolute",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    backgroundColor: "rgba(30, 64, 175, 0.05)",
    bottom: "30px",
    right: "10px",
  },
  iconCircle3: {
    position: "absolute",
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "rgba(100, 116, 139, 0.05)",
    bottom: "40px",
    left: "40px",
  },
  svgIllustration: {
    width: "220px",
    height: "220px",
    zIndex: 1,
  },
  illustrationText: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#0f172a",
    textAlign: "center",
    margin: "0",
  },
};