import pool from "../db/db.js";

export const validateTransaction = async (req, res, next) => {
    const {
        patient_id,
        amount,
        transaction_type,
        status
    } = req.body;

    // Validate patient_id
    if (
        patient_id === undefined ||
        typeof patient_id !== "number" ||
        patient_id <= 0
    ) {
        return res.status(400).json({
            message: "Invalid patient_id. It must be a positive number."
        });
    }

    try {
        // Verify that the user exists and has the patient role
        const patientResult = await pool.query(
            `
            SELECT id, role
            FROM users
            WHERE id = $1
            `,
            [patient_id]
        );

        if (patientResult.rows.length === 0) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        if (patientResult.rows[0].role !== "patient") {
            return res.status(400).json({
                message: "The selected user is not a patient"
            });
        }

        // Validate amount
        if (
            amount === undefined ||
            typeof amount !== "number" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            return res.status(400).json({
                message: "Invalid amount. It must be a positive number."
            });
        }

        // Validate transaction type
        const validTypes = [
            "consultation",
            "medicine",
            "lab",
            "other"
        ];

        if (
            transaction_type === undefined ||
            typeof transaction_type !== "string" ||
            !validTypes.includes(transaction_type)
        ) {
            return res.status(400).json({
                message: "Invalid transaction_type."
            });
        }

        // Validate status
        if (status !== undefined) {
            const validStatuses = [
                "pending",
                "completed",
                "cancelled"
            ];

            if (
                typeof status !== "string" ||
                !validStatuses.includes(status)
            ) {
                return res.status(400).json({
                    message:
                        "Invalid status. Use pending, completed, or cancelled."
                });
            }
        }

        next();

    } catch (error) {
        next(error);
    }
};