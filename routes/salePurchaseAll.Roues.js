const express = require("express");
const router = express.Router();
const salePurchaseAllocation = require("../controllers/purchasesController.js");
const {protect} = require("../controllers/authController.js");
router.get ("/",protect,salePurchaseAllocation.getAllData);
router.get ("/:id",protect,salePurchaseAllocation.getPurchaseById);
router.post("/",protect,salePurchaseAllocation.createData);
router.put("/:id",protect,salePurchaseAllocation.updateData);
router.delete("/:id",protect,salePurchaseAllocation.deleteData);




module.exports = router;