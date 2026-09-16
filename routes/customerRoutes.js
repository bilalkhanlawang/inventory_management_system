const express = require("express");
const router = express.Router();
const customersController = require("../controllers/customersController.js");
const {protect,restrictTo} = require("../controllers/authController.js");
router.get("/" , protect,restrictTo("user",'admin'), customersController.getAllData);
router.get("/:id" ,protect,restrictTo("user",'admin'), customersController.getDataById);
router.post("/" ,protect,restrictTo("user",'admin'), customersController.createData);
router.put("/:id" ,protect,restrictTo('admin'), customersController.updateData);
router.delete("/:id",protect,restrictTo('admin'), customersController.deleteData);



module.exports = router