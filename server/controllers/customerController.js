const pool = require("../db");

// GET all customers
const getCustomers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, phone, address, created_at
             FROM customers
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Get customers error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET one customer
const getCustomer = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, phone, address, created_at
             FROM customers
             WHERE id = $1 AND user_id = $2`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("Get customer error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// CREATE customer
const createCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const result = await pool.query(
            `INSERT INTO customers
             (user_id, name, email, phone, address)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, name, email, phone, address, created_at`,
            [
                req.user.id,
                name,
                email || null,
                phone || null,
                address || null
            ]
        );

        res.status(201).json({
            message: "Customer created",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error("Create customer error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// UPDATE customer
const updateCustomer = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            address
        } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const result = await pool.query(
            `UPDATE customers
             SET name = $1,
                 email = $2,
                 phone = $3,
                 address = $4
             WHERE id = $5 AND user_id = $6
             RETURNING id, name, email, phone, address, created_at`,
            [
                name,
                email || null,
                phone || null,
                address || null,
                req.params.id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            message: "Customer updated",
            customer: result.rows[0]
        });

    } catch (error) {
        console.error("Update customer error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// DELETE customer
const deleteCustomer = async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM customers
             WHERE id = $1 AND user_id = $2
             RETURNING id`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.json({
            message: "Customer deleted"
        });

    } catch (error) {
        console.error("Delete customer error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
};