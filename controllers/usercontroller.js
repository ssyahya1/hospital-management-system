
import pool from "../db/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const createUsers = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        const allowedRoles = ["patient", "doctor", "admin"];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                message: "Invalid role. Use patient, doctor, or admin"
            });
        }

        const existingUser = await pool.query(
            "SELECT id FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                message: "A user with this email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role,is_active, created_at
            `,
            [name, email, hashedPassword, role]
        );

        res.status(201).json({
            message: "User created successfully",
            user: result.rows[0]
        });

    } catch (error) {
        next(error);
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