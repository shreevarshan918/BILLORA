const express = require("express");

const {
    getBusiness,
    createOrUpdateBusiness
} = require("../controllers/businessController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getBusiness);

router.post("/", protect, createOrUpdateBusiness);

module.exports = router;