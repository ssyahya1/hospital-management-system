import pool from "../db/db.js";

export const validateAppointment = async (req, res, next) => {
    const {
        patient_id,
        appointment_date,
        appointment_time
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
        // Verify that the patient exists
        // patient_id refers to patients.id (PID), not users.id (UID)
        const patientResult = await pool.query(
            `
            SELECT p.id
            FROM patients p
            JOIN users u ON p.user_id = u.id
            WHERE p.id = $1
              AND u.role = 'patient'
            `,
            [patient_id]
        );

        if (patientResult.rows.length === 0) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        // Validate appointment date
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (
            appointment_date === undefined ||
            typeof appointment_date !== "string" ||
            !dateRegex.test(appointment_date)
        ) {
            return res.status(400).json({
                message: "Invalid appointment_date. Use YYYY-MM-DD."
            });
        }

        const today = new Date().toISOString().split("T")[0];

        if (appointment_date < today) {
            return res.status(400).json({
                message: "Invalid appointment_date. It cannot be in the past."
            });
        }

        // Validate appointment time
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (
            appointment_time === undefined ||
            typeof appointment_time !== "string" ||
            !timeRegex.test(appointment_time)
        ) {
            return res.status(400).json({
                message: "Invalid appointment_time. Use HH:MM."
            });
        }

        // Prevent appointment from being created in the past
        const now = new Date();

        const currentDate = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        if (
            appointment_date === currentDate &&
            appointment_time <= currentTime
        ) {
            return res.status(400).json({
                message: "Appointment time cannot be in the past."
            });
        }

        next();

    } catch (error) {
        next(error);
    }
};
