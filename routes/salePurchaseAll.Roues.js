const express = require("express");
const router = express.Router();
const salePurchaseAllocation = require("../controllers/salePurchaseAllController.js");
const {protect,restrictTo} = require("../controllers/authController.js");
router.get ("/",protect,restrictTo("user",'admin'),salePurchaseAllocation.getAllData);
router.get ("/:id",protect,restrictTo("user",'admin'),salePurchaseAllocation.getDataById);
router.post("/",protect,restrictTo("user",'admin'),salePurchaseAllocation.createData);
router.put("/:id",protect,restrictTo('admin'),salePurchaseAllocation.updateData);
router.delete("/:id",protect,restrictTo('admin'),salePurchaseAllocation.deleteData);




module.exports = router;