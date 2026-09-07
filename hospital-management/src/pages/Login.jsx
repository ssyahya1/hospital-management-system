import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await api.post("/api/users/login", formData);

      login(data.token, data.user);

      if (data.user.role === "patient") {
        navigate("/patient");
      } else if (data.user.role === "doctor") {
        navigate("/doctor");
      } else if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        setError("Invalid user role.");
      }
    } catch (error) {
      setError(
        error.message ||
          "Login failed. Please check your credentials."
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
            A modern healthcare management platform for patients,
            doctors, and administrators.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <span>✓</span>
              <p>Secure patient management</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Easy appointment management</p>
            </div>

            <div className="auth-feature">
              <span>✓</span>
              <p>Reliable healthcare records</p>
            </div>
          </div>
        </div>

        <div className="auth-card">

          <div className="auth-header">
            <h2>Welcome Back</h2>

            <p>
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>
            </div>

            {/* Forgot Password */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "15px",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/forgot-password")
                }
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#2563eb",
                  padding: "4px 0",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>

          </form>

          <div className="auth-footer">
            <span>
              Secure Healthcare Portal
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
