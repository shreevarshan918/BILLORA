const pool = require("../db");
const cloudinary = require("../config/cloudinary");

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


// UPLOAD BUSINESS LOGO
const uploadBusinessLogo = async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "Please select a logo image."
            });

        }


        const uploadToCloudinary = () => {

            return new Promise((resolve, reject) => {

                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "billora/business-logos",
                        resource_type: "image"
                    },
                    (error, result) => {

                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }

                    }
                );

                stream.end(req.file.buffer);

            });

        };


        const result = await uploadToCloudinary();


        const databaseResult = await pool.query(
            `UPDATE businesses
             SET logo_url = $1
             WHERE user_id = $2
             RETURNING *`,
            [
                result.secure_url,
                req.user.id
            ]
        );


        if (databaseResult.rows.length === 0) {

            return res.status(404).json({
                message: "Business profile not found. Save your business profile first."
            });

        }


        res.json({
            message: "Business logo uploaded successfully.",
            logo_url: result.secure_url,
            business: databaseResult.rows[0]
        });


    } catch (error) {

        console.error("Upload business logo error:", error);

        res.status(500).json({
            message: "Failed to upload business logo."
        });

    }

};


module.exports = {
    getBusiness,
    createOrUpdateBusiness,
    uploadBusinessLogo
};