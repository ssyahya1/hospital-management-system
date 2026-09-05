import pool from "../db/db.js";


export const getPatients = async (req, res, next) => {
     const { page=1, limit=10 } = req.query;
     const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const offset = (pageNumber - 1) * limitNumber;



    try {
        const result = await pool.query(`
    SELECT patients.id,
           users.name,
           users.email,
           patients.date_of_birth,
           patients.blood_group
    FROM patients
    JOIN users
    ON patients.user_id = users.id
    LIMIT $1 OFFSET $2
`, [limitNumber, offset]);
        return res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

export const createPatient = async (req, res, next) => {
    try {
        const { user_id, date_of_birth, blood_group } = req.body;
        const result = await pool.query(
            `INSERT INTO patients (user_id, date_of_birth, blood_group)
            VALUES ($1, $2, $3)
            RETURNING *`,
    [user_id, date_of_birth, blood_group]
); res.status(201).json({
            message: "Patient created successfully",
            user: result.rows[0]
        });
    }catch (error) {
         if (error.code === "23505") {
        return res.status(409).json({
            message: "Patient already exists for this user"
        });
    }
        next(error);
    }};

    export const getMyProfile = async (req, res, next) => {
    try {
        const result = await pool.query(
            `
            SELECT patients.id,
                   users.name,
                   users.email,
                   patients.date_of_birth,
                   patients.blood_group
            FROM patients
            JOIN users
            ON patients.user_id = users.id
            WHERE patients.user_id = $1
            `,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Patient profile not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        next(error);
    }
};