import pool from "../db/db.js";

export const createTransaction = async (req, res, next) => {

    const {
        patient_id,
        amount,
        transaction_type,
        status
    } = req.body;

    try {

        const patientCheck = await pool.query(
            `
            SELECT p.id
            FROM patients p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
              AND u.role = 'patient'
            `,
            [patient_id]
        );

        if (patientCheck.rows.length === 0) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const result = await pool.query(
            `
            INSERT INTO transactions
            (patient_id, amount, transaction_type, status)
            VALUES ($1, $2, $3, COALESCE($4, 'pending'))
            RETURNING *
            `,
            [
                patient_id,
                amount,
                transaction_type,
                status
            ]
        );

        res.status(201).json({
            message: "Transaction created successfully",
            transaction: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};

export const getTransactions = async (req, res, next) => {
    try {

        const result = await pool.query(
            `
            SELECT
                t.id,
                t.patient_id,
                u.name AS patient_name,
                t.amount,
                t.transaction_type,
                t.status,
                t.transaction_date
            FROM transactions t
            JOIN patients p ON t.patient_id = p.id
            JOIN users u ON p.user_id = u.id
            ORDER BY t.transaction_date DESC
            `
        );

        res.status(200).json({
            message: "Transactions retrieved successfully",
            transactions: result.rows
        });

    } catch (error) {
        next(error);
    }
};

export const getMyTransactions = async (req, res, next) => {
    try {

        const result = await pool.query(
            `
            SELECT
                t.id,
                t.amount,
                t.transaction_type,
                t.status,
                t.transaction_date
            FROM transactions t
            JOIN patients p ON t.patient_id = p.id
            WHERE p.user_id = $1
            ORDER BY t.transaction_date DESC
            `,
            [req.user.id]
        );

        res.status(200).json({
            message: "Your transactions retrieved successfully",
            transactions: result.rows
        });

    } catch (error) {
        next(error);
    }
};

export const getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                t.id,
                t.patient_id,
                u.name AS patient_name,
                t.amount,
                t.transaction_type,
                t.status,
                t.transaction_date,
                p.user_id AS patient_user_id
            FROM transactions t
            JOIN patients p ON t.patient_id = p.id
            JOIN users u ON p.user_id = u.id
            WHERE t.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        const transaction = result.rows[0];

        if (
            req.user.role === "patient" &&
            transaction.patient_user_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.status(200).json({
            message: "Transaction retrieved successfully",
            transaction
        });

    } catch (error) {
        next(error);
    }
};

export const updateTransaction = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const currentTransaction = await pool.query(
            `
            SELECT status
            FROM transactions
            WHERE id = $1
            `,
            [id]
        );

        if (currentTransaction.rows.length === 0) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        if (currentTransaction.rows[0].status !== "pending") {
            return res.status(409).json({
                message: `Transaction is already ${currentTransaction.rows[0].status} and cannot be updated.`
            });
        }

        const result = await pool.query(
            `
            UPDATE transactions
            SET status = $1
            WHERE id = $2
            RETURNING *
            `,
            [status, id]
        );

        res.status(200).json({
            message: "Transaction updated successfully",
            transaction: result.rows[0]
        });

    } catch (error) {
        next(error);
    }
};