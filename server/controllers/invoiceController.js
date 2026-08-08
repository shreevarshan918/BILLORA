const pool = require("../db");


// GET all invoices
const getInvoices = async (req, res) => {
    // Automatically mark unpaid invoices as overdue

    try {
        await pool.query(
    `UPDATE invoices
     SET status = 'OVERDUE'
     WHERE user_id = $1
     AND due_date < CURRENT_DATE
     AND status NOT IN ('PAID', 'OVERDUE')`,
    [req.user.id]
);
        const result = await pool.query(
            `SELECT
                i.id,
                i.invoice_number,
                i.invoice_date,
                i.due_date,
                i.subtotal,
                i.discount,
                i.tax,
                i.total,
                i.status,
                c.name AS customer_name
             FROM invoices i
             JOIN customers c ON i.customer_id = c.id
             WHERE i.user_id = $1
             ORDER BY i.created_at DESC`,
            [req.user.id]
        );

        res.json(result.rows);

    } catch (error) {
        console.error("Get invoices error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET one invoice with items
const getInvoice = async (req, res) => {
    try {

        const invoiceResult = await pool.query(
            `SELECT
                i.*,
                c.name AS customer_name,
                c.email AS customer_email,
                c.phone AS customer_phone,
                c.address AS customer_address
             FROM invoices i
             JOIN customers c ON i.customer_id = c.id
             WHERE i.id = $1
             AND i.user_id = $2`,
            [req.params.id, req.user.id]
        );

        if (invoiceResult.rows.length === 0) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        const itemsResult = await pool.query(
            `SELECT
                id,
                description,
                quantity,
                price,
                amount
             FROM invoice_items
             WHERE invoice_id = $1
             ORDER BY id`,
            [req.params.id]
        );

        res.json({
            invoice: invoiceResult.rows[0],
            items: itemsResult.rows
        });

    } catch (error) {
        console.error("Get invoice error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// CREATE invoice
const createInvoice = async (req, res) => {
    const client = await pool.connect();

    try {

        const {
            customer_id,
            invoice_date,
            due_date,
            discount = 0,
            tax = 0,
            items
        } = req.body;

        if (!customer_id) {
            return res.status(400).json({
                message: "Customer is required"
            });
        }

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: "At least one invoice item is required"
            });
        }


        // Verify customer belongs to user
        const customerCheck = await client.query(
            `SELECT id
             FROM customers
             WHERE id = $1
             AND user_id = $2`,
            [customer_id, req.user.id]
        );

        if (customerCheck.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }


        // Calculate subtotal
        let subtotal = 0;

        const processedItems = items.map((item) => {

            const quantity = Number(item.quantity);
            const price = Number(item.price);

            const amount = quantity * price;

            subtotal += amount;

            return {
                description: item.description,
                quantity,
                price,
                amount
            };

        });


        const discountAmount = Number(discount) || 0;
        const taxAmount = Number(tax) || 0;

        const total =
            subtotal -
            discountAmount +
            taxAmount;


        await client.query("BEGIN");


        // Generate invoice number
        const invoiceNumberResult = await client.query(
            `SELECT COUNT(*) + 1 AS next_number
             FROM invoices
             WHERE user_id = $1`,
            [req.user.id]
        );

        const nextNumber =
            invoiceNumberResult.rows[0].next_number;

        const invoiceNumber =
            `INV-${new Date().getFullYear()}-${String(nextNumber).padStart(4, "0")}`;


        // Insert invoice
        const invoiceResult = await client.query(
            `INSERT INTO invoices
            (
                user_id,
                customer_id,
                invoice_number,
                invoice_date,
                due_date,
                subtotal,
                discount,
                tax,
                total,
                status
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8,$9,'DRAFT')
            RETURNING *`,
            [
                req.user.id,
                customer_id,
                invoiceNumber,
                invoice_date || new Date(),
                due_date || null,
                subtotal,
                discountAmount,
                taxAmount,
                total
            ]
        );


        const invoice = invoiceResult.rows[0];


        // Insert items
        for (const item of processedItems) {

            await client.query(
                `INSERT INTO invoice_items
                (
                    invoice_id,
                    description,
                    quantity,
                    price,
                    amount
                )
                VALUES
                ($1,$2,$3,$4,$5)`,
                [
                    invoice.id,
                    item.description,
                    item.quantity,
                    item.price,
                    item.amount
                ]
            );

        }


        await client.query("COMMIT");


        res.status(201).json({
            message: "Invoice created",
            invoice
        });

    } catch (error) {

        await client.query("ROLLBACK");

        console.error("Create invoice error:", error);

        res.status(500).json({
            message: "Server error"
        });

    } finally {

        client.release();

    }
};


// DELETE invoice
const deleteInvoice = async (req, res) => {

    try {

        const result = await pool.query(
            `DELETE FROM invoices
             WHERE id = $1
             AND user_id = $2
             RETURNING id`,
            [req.params.id, req.user.id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Invoice not found"
            });

        }

        res.json({
            message: "Invoice deleted"
        });

    } catch (error) {

        console.error("Delete invoice error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }
};
// UPDATE invoice status
const updateInvoiceStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const allowedStatuses = [
            "DRAFT",
            "SENT",
            "PAID",
            "OVERDUE"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid invoice status"
            });
        }

        const result = await pool.query(
            `UPDATE invoices
             SET status = $1
             WHERE id = $2
             AND user_id = $3
             RETURNING *`,
            [
                status,
                req.params.id,
                req.user.id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.json({
            message: "Invoice status updated",
            invoice: result.rows[0]
        });

    } catch (error) {

        console.error("Update invoice status error:", error);

        res.status(500).json({
            message: "Server error"
        });

    }

};

module.exports = {
    getInvoices,
    getInvoice,
    createInvoice,
    deleteInvoice,
    updateInvoiceStatus
};
