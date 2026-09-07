import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing password reset token.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await api.post(
        "/api/users/reset-password",
        {
          token,
          password,
        }
      );

      setMessage(
        data.message ||
          "Password reset successfully. You can now log in."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.message ||
          "Unable to reset password. The link may be invalid or expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Left Side */}
        <div className="auth-brand">
          <div className="hospital-icon">+</div>

          <h1>Hospital Management System</h1>

          <p>
            Create a new secure password and regain access
            to your healthcare portal.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span>✓</span>
              <p>Secure password reset</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Protected account access</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Your account stays secure</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="auth-card">
          <div className="auth-header">
            <h2>Reset Password</h2>

            <p>
              Enter your new password below.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {/* New Password */}
            <div className="form-group">
              <label htmlFor="password">
                New Password
              </label>

              <div className="password-wrapper">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "6px 10px",
                    backgroundColor: "transparent",
                    color: "#2563eb",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password
              </label>

              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "6px 10px",
                    backgroundColor: "transparent",
                    color: "#2563eb",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "block",
                width: "100%",
                height: "48px",
                padding: "0 20px",
                marginTop: "15px",
                backgroundColor: loading
                  ? "#93c5fd"
                  : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
                boxSizing: "border-box",
                transition:
                  "background-color 0.2s ease",
              }}
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>

          </form>

          {/* Back to Login */}
          <div
            className="auth-footer"
            style={{
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 18px",
                backgroundColor: "#ffffff",
                color: "#2563eb",
                border: "1px solid #2563eb",
                borderRadius: "7px",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              ← Back to Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
