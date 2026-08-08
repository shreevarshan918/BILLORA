const customerRoutes = require("./routes/customerRoutes");
const express = require("express");
const invoiceRoutes = require("./routes/invoiceRoutes");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const authRoutes = require("./routes/authRoutes");
const businessRoutes = require("./routes/businessRoutes");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);
app.get("/", (req, res) => {
    res.json({
        message: "Billora API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        service: "Billora Backend"
    });
});

app.listen(PORT, () => {
    console.log(`Billora server running on http://localhost:${PORT}`);
});