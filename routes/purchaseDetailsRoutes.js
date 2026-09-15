const express = require ("express");
const router = express.Router();
const purchasDetailsController = require("../controllers/parchaseDetailsController.js");
const {protect} = require("../controllers/authController.js")
router.get("/",protect,purchasDetailsController.getALLData);
router.get("/:id" ,protect, purchasDetailsController.getDataById);
router.post("/",protect,purchasDetailsController.createPurchaseDetails);
router.put("/:id",protect,purchasDetailsController.updateData);
router.delete("/:id",protect,purchasDetailsController.deleteData);


module.exports = router;