const pool = require("../db");


// GET business profile
const getBusiness = async (req, res) => {

    try {

        const result = await pool.query(
            `SELECT *
             FROM businesses
             WHERE user_id = $1
             LIMIT 1`,
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.json(null);
        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error("Get business error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


// CREATE / UPDATE business profile
const createOrUpdateBusiness = async (req, res) => {

    try {

        const {
            name,
            email,
            phone,
            address,
            gstin,
            upi_id
        } = req.body;


        if (!name || !name.trim()) {

            return res.status(400).json({
                message: "Business name is required"
            });

        }


        const existing = await pool.query(
            `SELECT id
             FROM businesses
             WHERE user_id = $1
             LIMIT 1`,
            [req.user.id]
        );


        let result;


        if (existing.rows.length > 0) {

            // UPDATE existing business

            result = await pool.query(
                `UPDATE businesses
                 SET
                    business_name = $1,
                    email = $2,
                    phone = $3,
                    address = $4,
                    gstin = $5,
                    upi_id = $6
                 WHERE user_id = $7
                 RETURNING *`,
                [
                    name.trim(),
                    email || null,
                    phone || null,
                    address || null,
                    gstin || null,
                    upi_id || null,
                    req.user.id
                ]
            );

        } else {

            // CREATE new business

            result = await pool.query(
                `INSERT INTO businesses
                (
                    user_id,
                    business_name,
                    email,
                    phone,
                    address,
                    gstin,
                    upi_id
                )
                VALUES
                ($1,$2,$3,$4,$5,$6,$7)
                RETURNING *`,
                [
                    req.user.id,
                    name.trim(),
                    email || null,
                    phone || null,
                    address || null,
                    gstin || null,
                    upi_id || null
                ]
            );

        }


        res.json({
            message: "Business profile saved",
            business: result.rows[0]
        });


    } catch (error) {

        console.error("Save business error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};


module.exports = {
    getBusiness,
    createOrUpdateBusiness
};