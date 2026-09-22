const express = require("express");
const router =  express.Router();
const authController = require("../controllers/authController");

router.post("/signup",authController.signup);
router.post("/login",authController.login);
router.post("/forgotPassword",authController.forgotPassword );
router.patch("/resetpassword/:token",authController.resetPassword);
router.patch("/updateMyPassword",authController.protect, authController.updateMyPassword);
router.patch("/updateMe",authController.protect, authController.updateMe);
router.delete("/deleteMe",authController.protect, authController.deleteMe);


module.exports = router;