const express = require("express");
const router = express.Router();
const customersController = require("../controllers/customersController.js");
const {protect} = require("../controllers/authController.js");
router.get("/" , protect, customersController.getAllData);
router.get("/:id" ,protect, customersController.getDataById);
router.post("/" ,protect, customersController.createData);
router.put("/:id" ,protect, customersController.updateData);
router.delete("/:id",protect, customersController.deleteData);



module.exports = router