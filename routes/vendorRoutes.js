const express = require("express");
const router = express.Router();
const vendorsController = require("../controllers/vendorsController.js");


router.get("/" , vendorsController.getAllData);
router.get("/:id" , vendorsController.getVendorById);
router.post("/" , vendorsController.createData);
router.put("/:id" , vendorsController.updateData);
router.delete("/:id" , vendorsController.deleteData);


module.exports = router;