import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import{Resend} from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export const createUsers = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const {
            name,
            email,
            password,
            role,
            date_of_birth,
            blood_group
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message:
                    "Name, email, password and role are required"
            });
        }

        const allowedRoles = [
            "patient",
            "doctor",
            "admin"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message:
                    "Invalid role. Use patient, doctor, or admin"
            });
        }

        // Patient-specific validation
        if (role === "patient" && !date_of_birth) {
            return res.status(400).json({
                message:
                    "Date of birth is required for patients"
            });
        }

        const existingUser = await client.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message:
                    "A user with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await client.query("BEGIN");

        const result = await client.query(
            `
            INSERT INTO users
                (name, email, password, role)
            VALUES
                ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                email,
                role,
                is_active,
                created_at
            `,
            [
                name,
                email,
                hashedPassword,
                role
            ]
        );

        const newUser = result.rows[0];

        // Automatically create patient record
        if (role === "patient") {
            await client.query(
                `
                INSERT INTO patients
                    (user_id, date_of_birth, blood_group)
                VALUES
                    ($1, $2, $3)
                `,
                [
                    newUser.id,
                    date_of_birth,
                    blood_group || null
                ]
            );
        }

        await client.query("COMMIT");

        res.status(201).json({
            message:
                "User created successfully",
            user: newUser
        });

    } catch (error) {
        await client.query("ROLLBACK");
        next(error);

    } finally {
        client.release();
    }
};
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
         // Check if the account is active
        if (!user.is_active) {
            return res.status(403).json({
                message:
                    "Your account has been deactivated. Please contact an administrator."
            });
        }


        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        next(error);
    }
};


export const getMyProfile = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT id, name, email, role, created_at
            FROM users
            WHERE id = $1
            `,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        next(error);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT id, name, email, role, is_active, created_at
            FROM users
            ORDER BY id
            `
        );

        res.status(200).json(result.rows);

    } catch (error) {
        next(error);
    }
};

// Update a user
export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({
                message: "Name, email and role are required"
            });
        }

        const allowedRoles = ["patient", "doctor", "admin"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Use patient, doctor, or admin"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [id]
        );

        if (existingUser.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const emailExists = await pool.query(
            "SELECT id FROM users WHERE email = $1 AND id != $2",
            [email, id]
        );

        if (emailExists.rows.length > 0) {
            return res.status(409).json({
                message: "A user with this email already exists"
            });
        }

        const result = await pool.query(
            `
            UPDATE users
            SET name = $1,
                email = $2,
                role = $3
            WHERE id = $4
            RETURNING id, name, email, role, created_at
            `,
            [name, email, role, id]
        );

        res.status(200).json({
            message: "User updated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

export const deactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE users
            SET is_active = FALSE
            WHERE id = $1
            RETURNING id, name, email, role, is_active
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deactivated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

export const reactivateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            UPDATE users
            SET is_active = TRUE
            WHERE id = $1
            RETURNING id, name, email, role, is_active
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User reactivated successfully",
            user: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const result = await pool.query(
            "SELECT id, name FROM users WHERE email = $1",
            [email]
        );

        // Don't reveal whether the email exists.
        if (result.rows.length === 0) {
            return res.status(200).json({
                message:
                    "If an account exists with this email, a password reset link has been sent."
            });
        }

        const user = result.rows[0];

        const resetToken = crypto.randomBytes(32).toString("hex");

        const resetTokenExpires = new Date(
            Date.now() + 15 * 60 * 1000
        );

        await pool.query(
            `
            UPDATE users
            SET reset_token = $1,
                reset_token_expires = $2
            WHERE id = $3
            `,
            [resetToken, resetTokenExpires, user.id]
        );

        const resetLink =
            `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

        await resend.emails.send({
            from: "Hospital Management System <onboarding@resend.dev>",
            to: email,
            subject: "Reset Your Hospital Management System Password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h2>Password Reset</h2>

                    <p>Hello ${user.name},</p>

                    <p>
                        We received a request to reset your password.
                    </p>

                    <p>
                        Click the button below to create a new password:
                    </p>

                    <p>
                        <a
                            href="${resetLink}"
                            style="
                                display: inline-block;
                                padding: 12px 20px;
                                background: #2563eb;
                                color: white;
                                text-decoration: none;
                                border-radius: 6px;
                            "
                        >
                            Reset Password
                        </a>
                    </p>

                    <p>
                        This link will expire in 15 minutes.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>
                </div>
            `
        });

        res.status(200).json({
            message:
                "If an account exists with this email, a password reset link has been sent."
        });

    } catch (error) {
        next(error);
    }
};
export const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                message: "Token and new password are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters long"
            });
        }

        const result = await pool.query(
            `
            SELECT id
            FROM users
            WHERE reset_token = $1
              AND reset_token_expires > NOW()
            `,
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                message:
                    "Invalid or expired password reset token"
            });
        }

        const userId = result.rows[0].id;

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        await pool.query(
            `
            UPDATE users
            SET password = $1,
                reset_token = NULL,
                reset_token_expires = NULL
            WHERE id = $2
            `,
            [hashedPassword, userId]
        );

        res.status(200).json({
            message:
                "Password reset successfully. You can now log in."
        });

    } catch (error) {
        next(error);
    }
};