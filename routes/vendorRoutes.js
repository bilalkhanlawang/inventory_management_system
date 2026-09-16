const express = require("express");
const router = express.Router();
const vendorsController = require("../controllers/vendorsController.js");
const{protect,restrictTo} = require("../controllers/authController.js")

router.get("/" ,protect,restrictTo("user",'admin'), vendorsController.getAllData);
router.get("/:id" ,protect,restrictTo("user",'admin'), vendorsController.getVendorById);
router.post("/" , protect,restrictTo("user",'admin'),vendorsController.createData);
router.put("/:id" ,protect,restrictTo('admin'), vendorsController.updateData);
router.delete("/:id" ,protect,restrictTo('admin'), vendorsController.deleteData);


module.exports = router;