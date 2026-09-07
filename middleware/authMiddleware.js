import jwt from "jsonwebtoken";
import pool from "../db/db.js";

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Check the user's current status in the database
        const result = await pool.query(
            "SELECT id, role, is_active FROM users WHERE id = $1",
            [decoded.id]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        const user = result.rows[0];

        // Block deactivated accounts
        if (!user.is_active) {
            return res.status(403).json({
                message:
                    "Your account has been deactivated. Please contact an administrator."
            });
        }

        // Use the current database values
        req.user = {
            id: user.id,
            role: user.role
        };

        next();

    } catch (error) {
        console.error("Auth middleware error:", error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};