
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const data = await api.post(
        "/api/users/forgot-password",
        { email }
      );

      setMessage(
        data.message ||
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="auth-brand">
          <div className="hospital-icon">+</div>

          <h1>Hospital Management System</h1>

          <p>
            Reset your account password securely and regain
            access to your healthcare portal.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span>✓</span>
              <p>Secure password recovery</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Protected account access</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Simple password reset</p>
            </div>
          </div>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <h2>Forgot Password?</h2>
            <p>
              Enter your email address and we'll send you a
              password reset link.
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

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>
          </form>

          <div className="auth-footer">
            <button
              type="button"
              className="forgot-back-button"
              onClick={() => navigate("/login")}
            >
              ← Back to Login
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;