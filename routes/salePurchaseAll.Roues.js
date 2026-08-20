const express = require("express");
const router = express.Router();
const salePurchaseAllocation = require("../controllers/purchasesController.js");

router.get ("/",salePurchaseAllocation.getAllData);
router.get ("/:id",salePurchaseAllocation.getPurchaseById);
router.post("/",salePurchaseAllocation.createData);
router.put("/:id",salePurchaseAllocation.updateData);
router.delete("/:id",salePurchaseAllocation.deleteData);




module.exports = router;