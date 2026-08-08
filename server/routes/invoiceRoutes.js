const express = require("express");

const {
    getInvoices,
    getInvoice,
    createInvoice,
    deleteInvoice,
    updateInvoiceStatus
} = require("../controllers/invoiceController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getInvoices);

router.patch(
    "/:id/status",
    protect,
    updateInvoiceStatus
);

router.get("/:id", protect, getInvoice);

router.post("/", protect, createInvoice);

router.delete("/:id", protect, deleteInvoice);

module.exports = router;