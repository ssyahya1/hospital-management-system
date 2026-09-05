import { useState } from "react";
import api from "../../services/api";

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "patient",
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {
            const data = await api.post("/api/users", formData);

            setMessage(
                data.message || "User created successfully."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                role: "patient",
            });

        } catch (error) {
            setError(
                error.message || "Failed to create user."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">

            <div className="page-header">
                <div>
                    <h1>Add User</h1>
                    <p>
                        Create a new patient, doctor, or administrator account.
                    </p>
                </div>
            </div>

            <div className="form-card">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter full name"
                            value={formData.name}
                            onChange={handleChange}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email address"
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

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">
                            User Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="patient">
                                Patient
                            </option>

                            <option value="doctor">
                                Doctor
                            </option>

                            <option value="admin">
                                Administrator
                            </option>
                        </select>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="success-message">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Creating User..." : "Create User"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddUser;