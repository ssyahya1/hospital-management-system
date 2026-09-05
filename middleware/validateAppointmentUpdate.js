import pool from "../db/db.js";

export const validateAppointmentUpdate = async (req, res, next) => {

    const {
        appointment_date,
        appointment_time,
        status
    } = req.body;

    if (
        appointment_date === undefined &&
        appointment_time === undefined &&
        status === undefined
    ) {
        return res.status(400).json({
            message: "At least one field is required"
        });
    }

    try {

        // Get the existing appointment
        const result = await pool.query(
            `
            SELECT appointment_date, appointment_time
            FROM appointments
            WHERE id = $1
            `,
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const existingAppointment = result.rows[0];

        // Use new date if provided, otherwise existing date
        const finalDate =
            appointment_date !== undefined
                ? appointment_date
                : existingAppointment.appointment_date
                    .toISOString()
                    .split("T")[0];

        // Use new time if provided, otherwise existing time
        const finalTime =
            appointment_time !== undefined
                ? appointment_time
                : existingAppointment.appointment_time
                    .toString()
                    .slice(0, 5);

        // Validate appointment date
        if (appointment_date !== undefined) {

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

            if (
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
        }

        // Validate appointment time
        if (appointment_time !== undefined) {

            const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

            if (
                typeof appointment_time !== "string" ||
                !timeRegex.test(appointment_time)
            ) {
                return res.status(400).json({
                    message: "Invalid appointment_time. Use HH:MM."
                });
            }
        }

        // Prevent appointment from being moved into the past
        const now = new Date();

        const currentDate = now.toISOString().split("T")[0];
        const currentTime = now.toTimeString().slice(0, 5);

        if (
            finalDate === currentDate &&
            finalTime <= currentTime
        ) {
            return res.status(400).json({
                message: "Appointment date and time cannot be in the past."
            });
        }

        // Validate status
        if (status !== undefined) {

            const validStatuses = [
                "scheduled",
                "completed",
                "cancelled"
            ];

            if (
                typeof status !== "string" ||
                !validStatuses.includes(status)
            ) {
                return res.status(400).json({
                    message: "Invalid status. Use scheduled, completed, or cancelled."
                });
            }
        }

        next();

    } catch (error) {
        next(error);
    }
};