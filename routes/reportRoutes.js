const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController.js");
const { protect } = require("../controllers/authController.js");

router.get("/sales", protect, reportController.getSalesReport);
router.get("/purchases", protect, reportController.getPurchasesReport);

module.exports = router;