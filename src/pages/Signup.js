import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader, Check } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (pwd) => {
    return pwd.length >= 8;
  };

  const validateName = (fullName) => {
    return fullName.trim().length >= 2;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation checks
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!validateName(name)) {
      setError("Full name must be at least 2 characters");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("https://taskflow-backend-6tfo.onrender.com/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setError(data.message || "Signup failed. Please try again.");
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
      handleSignup(e);
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Left Section - Form */}
      <div style={styles.leftContainer}>
        <div style={styles.formWrapper}>
          {/* Header */}
          <div style={styles.header}>
            <h1 style={styles.title}>Get Started</h1>
            <p style={styles.subtitle}>Create your account to get access</p>
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
                Account created successfully! Redirecting to login...
              </span>
            </div>
          )}

          {/* Form Fields */}
          <div style={styles.form}>
            {/* Full Name Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.input}
                disabled={loading}
              />
              {name && validateName(name) && (
                <span style={styles.validationText}>✓ Name is valid</span>
              )}
            </div>

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
              {email && validateEmail(email) && (
                <span style={styles.validationText}>✓ Email is valid</span>
              )}
            </div>

            {/* Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
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
              <span style={styles.helperText}>
                {password.length >= 8 ? "✓" : "•"} At least 8 characters
              </span>
            </div>

            {/* Confirm Password Input */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  style={styles.passwordInput}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeButton}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} color="#6b7280" />
                  ) : (
                    <Eye size={18} color="#6b7280" />
                  )}
                </button>
              </div>
              {confirmPassword && password === confirmPassword && (
                <span style={styles.validationText}>✓ Passwords match</span>
              )}
              {confirmPassword && password !== confirmPassword && (
                <span style={{ ...styles.validationText, color: "#d32f2f" }}>
                  ✗ Passwords do not match
                </span>
              )}
            </div>

            {/* Terms Checkbox */}
            <div style={styles.termsContainer}>
              <input
                type="checkbox"
                id="terms"
                style={styles.checkbox}
                disabled={loading}
              />
              <label htmlFor="terms" style={styles.termsLabel}>
                I agree to the{" "}
                <a href="#" style={styles.termsLink}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" style={styles.termsLink}>
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSignup}
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
                  <span>Creating Account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{" "}
              <a href="/login" style={styles.loginLink}>
                Sign in here
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
              <circle cx="150" cy="130" r="45" fill="none" stroke="#0f172a" strokeWidth="2" />
              <path
                d="M 120 130 L 140 145 L 180 110"
                stroke="#2e7d32"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect x="70" y="190" width="160" height="60" rx="8" fill="none" stroke="#0f172a" strokeWidth="2" />
              <line x1="70" y1="220" x2="230" y2="220" stroke="#0f172a" strokeWidth="1.5" />
              <circle cx="90" cy="205" r="3" fill="#0f172a" />
              <circle cx="105" cy="205" r="3" fill="#0f172a" />
              <circle cx="120" cy="205" r="3" fill="#0f172a" />
            </svg>
          </div>
          <p style={styles.illustrationText}>Join Thousands of Users</p>
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
    overflowY: "auto",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "420px",
  },
  header: {
    marginBottom: "28px",
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
    gap: "16px",
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
  validationText: {
    fontSize: "12px",
    color: "#2e7d32",
    fontWeight: "500",
    marginTop: "2px",
  },
  helperText: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "400",
    marginTop: "2px",
  },
  termsContainer: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    marginTop: "4px",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    marginTop: "2px",
    cursor: "pointer",
    accentColor: "#0f172a",
  },
  termsLabel: {
    fontSize: "13px",
    color: "#64748b",
    fontWeight: "400",
    lineHeight: "1.5",
  },
  termsLink: {
    color: "#0f172a",
    fontWeight: "600",
    textDecoration: "none",
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
    marginTop: "8px",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0",
  },
  loginLink: {
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
    backgroundColor: "rgba(46, 125, 50, 0.05)",
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