import { useState } from "react";
import api from "../../services/api";

const AddUser = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "patient",
        date_of_birth: "",
        blood_group: "",
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
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            };

            if (formData.role === "patient") {
                dataToSend.date_of_birth =
                    formData.date_of_birth;

                dataToSend.blood_group =
                    formData.blood_group || null;
            }

            const data = await api.post(
                "/api/users",
                dataToSend
            );

            setMessage(
                data.message ||
                "User created successfully."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                role: "patient",
                date_of_birth: "",
                blood_group: "",
            });

        } catch (error) {
            setError(
                error.message ||
                "Failed to create user."
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
                        Create a new patient, doctor, or
                        administrator account.
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

                    {formData.role === "patient" && (
                        <>
                            <div className="form-group">
                                <label htmlFor="date_of_birth">
                                    Date of Birth
                                </label>

                                <input
                                    id="date_of_birth"
                                    name="date_of_birth"
                                    type="date"
                                    value={
                                        formData.date_of_birth
                                    }
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="blood_group">
                                    Blood Group
                                </label>

                                <select
                                    id="blood_group"
                                    name="blood_group"
                                    value={
                                        formData.blood_group
                                    }
                                    onChange={handleChange}
                                >
                                    <option value="">
                                        Select blood group
                                    </option>

                                    <option value="A+">
                                        A+
                                    </option>

                                    <option value="A-">
                                        A-
                                    </option>

                                    <option value="B+">
                                        B+
                                    </option>

                                    <option value="B-">
                                        B-
                                    </option>

                                    <option value="AB+">
                                        AB+
                                    </option>

                                    <option value="AB-">
                                        AB-
                                    </option>

                                    <option value="O+">
                                        O+
                                    </option>

                                    <option value="O-">
                                        O-
                                    </option>
                                </select>
                            </div>
                        </>
                    )}

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
                        {loading
                            ? "Creating User..."
                            : "Create User"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default AddUser;