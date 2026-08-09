const express = require("express");

const {
    getBusiness,
    createOrUpdateBusiness,
    uploadBusinessLogo
} = require("../controllers/businessController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", protect, getBusiness);

router.post("/", protect, createOrUpdateBusiness);

router.post(
    "/logo",
    protect,
    upload.single("logo"),
    uploadBusinessLogo
);

module.exports = router;