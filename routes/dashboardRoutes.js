const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.js");
const { protect } = require("../controllers/authController.js");

router.get("/", protect, dashboardController.getDashboardStats);

module.exports = router;