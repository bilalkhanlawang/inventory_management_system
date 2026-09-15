const express = require("express");
const router = express.Router();
const vendorsController = require("../controllers/vendorsController.js");
const{protect} = require("../controllers/authController.js")

router.get("/" ,protect, vendorsController.getAllData);
router.get("/:id" ,protect, vendorsController.getVendorById);
router.post("/" , protect,vendorsController.createData);
router.put("/:id" ,protect, vendorsController.updateData);
router.delete("/:id" ,protect, vendorsController.deleteData);


module.exports = router;