import pool from "../db/db.js";

export const createAppointments = async (req, res, next) => {
    const {
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time
    } = req.body;

    try {
        // Check patient
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

        // Determine doctor
        let assignedDoctorId;

        if (req.user.role === "doctor") {
            // Doctor automatically becomes the assigned doctor
            assignedDoctorId = req.user.id;
        } else if (req.user.role === "admin") {
            // Admin must select a doctor
            if (!doctor_id) {
                return res.status(400).json({
                    message: "Doctor ID is required"
                });
            }

            const doctorCheck = await pool.query(
                `
                SELECT id
                FROM users
                WHERE id = $1
                  AND role = 'doctor'
                `,
                [doctor_id]
            );

            if (doctorCheck.rows.length === 0) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            assignedDoctorId = doctor_id;
        }

        const result = await pool.query(
            `
            INSERT INTO appointments
            (
                patient_id,
                doctor_id,
                appointment_date,
                appointment_time
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
            `,
            [
                patient_id,
                assignedDoctorId,
                appointment_date,
                appointment_time
            ]
        );

        res.status(201).json({
            message: "Appointment created successfully",
            appointment: result.rows[0]
        });

    } catch (error) {

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Doctor already has an appointment at this date and time."
            });
        }

        next(error);
    }
};


export const getAppointments = async (req, res, next) => {
    try {
        let result;

        if (req.user.role === "doctor") {
            result = await pool.query(
                `
                SELECT
                    a.id,
                    a.patient_id,
                    a.doctor_id,
                    a.appointment_date,
                    a.appointment_time,
                    a.status,
                    patient.name AS patient_name,
                    doctor.name AS doctor_name
                FROM appointments a
                JOIN patients p
                    ON a.patient_id = p.id
                JOIN users patient
                    ON p.user_id = patient.id
                JOIN users doctor
                    ON a.doctor_id = doctor.id
                WHERE a.doctor_id = $1
                ORDER BY a.appointment_date, a.appointment_time
                `,
                [req.user.id]
            );
        } else {
            result = await pool.query(
                `
                SELECT
                    a.id,
                    a.patient_id,
                    a.doctor_id,
                    a.appointment_date,
                    a.appointment_time,
                    a.status,
                    patient.name AS patient_name,
                    doctor.name AS doctor_name
                FROM appointments a
                JOIN patients p
                    ON a.patient_id = p.id
                JOIN users patient
                    ON p.user_id = patient.id
                JOIN users doctor
                    ON a.doctor_id = doctor.id
                ORDER BY a.appointment_date, a.appointment_time
                `
            );
        }

        res.status(200).json({
            message: "Appointments retrieved successfully",
            appointments: result.rows
        });

    } catch (error) {
        next(error);
    }
};


export const getMyAppointments = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT
                a.id,
                a.appointment_date,
                a.appointment_time,
                a.status,
                u.name AS doctor_name
            FROM appointments a
            JOIN patients p
                ON a.patient_id = p.id
            JOIN users u
                ON a.doctor_id = u.id
            WHERE p.user_id = $1
            ORDER BY a.appointment_date, a.appointment_time
            `,
            [req.user.id]
        );

        res.status(200).json({
            message: "Your appointments retrieved successfully",
            appointments: result.rows
        });

    } catch (error) {
        next(error);
    }
};


export const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                a.id,
                a.patient_id,
                a.doctor_id,
                a.appointment_date,
                a.appointment_time,
                a.status,
                p.user_id AS patient_user_id,
                patient.name AS patient_name,
                doctor.name AS doctor_name
            FROM appointments a
            JOIN patients p
                ON a.patient_id = p.id
            JOIN users patient
                ON p.user_id = patient.id
            JOIN users doctor
                ON a.doctor_id = doctor.id
            WHERE a.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const appointment = result.rows[0];

        if (
            req.user.role === "patient" &&
            appointment.patient_user_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        if (
            req.user.role === "doctor" &&
            appointment.doctor_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        res.status(200).json({
            message: "Appointment retrieved successfully",
            appointment
        });

    } catch (error) {
        next(error);
    }
};


export const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            appointment_date,
            appointment_time,
            status,
            doctor_id
        } = req.body;

        // Get current appointment
        const appointmentCheck = await pool.query(
            `
            SELECT
                id,
                doctor_id,
                status
            FROM appointments
            WHERE id = $1
            `,
            [id]
        );

        if (appointmentCheck.rows.length === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        const currentAppointment = appointmentCheck.rows[0];

        // Doctor can only update their own appointment
        if (
            req.user.role === "doctor" &&
            currentAppointment.doctor_id !== req.user.id
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // Only scheduled appointments can be updated
        if (
            status !== undefined &&
            currentAppointment.status !== "scheduled"
        ) {
            return res.status(409).json({
                message: `Appointment is already ${currentAppointment.status} and cannot be updated.`
            });
        }

        // Only admin can change the assigned doctor
        let assignedDoctorId = currentAppointment.doctor_id;

        if (req.user.role === "admin" && doctor_id !== undefined) {
            const doctorCheck = await pool.query(
                `
                SELECT id
                FROM users
                WHERE id = $1
                  AND role = 'doctor'
                `,
                [doctor_id]
            );

            if (doctorCheck.rows.length === 0) {
                return res.status(404).json({
                    message: "Doctor not found"
                });
            }

            assignedDoctorId = doctor_id;
        }

        const result = await pool.query(
            `
            UPDATE appointments
            SET
                appointment_date = COALESCE($1, appointment_date),
                appointment_time = COALESCE($2, appointment_time),
                status = COALESCE($3, status),
                doctor_id = $4
            WHERE id = $5
            RETURNING *
            `,
            [
                appointment_date,
                appointment_time,
                status,
                assignedDoctorId,
                id
            ]
        );

        res.status(200).json({
            message: "Appointment updated successfully",
            appointment: result.rows[0]
        });

    } catch (error) {

        if (error.code === "23505") {
            return res.status(409).json({
                message: "Doctor already has an appointment at this date and time."
            });
        }

        next(error);
    }
};