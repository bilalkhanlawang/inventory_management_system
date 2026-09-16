const express = require ("express");
const router = express.Router();
const purchasDetailsController = require("../controllers/parchaseDetailsController.js");
const {protect,restrictTo} = require("../controllers/authController.js")
router.get("/",protect,restrictTo("user",'admin'),purchasDetailsController.getALLData);
router.get("/:id" ,protect,restrictTo("user",'admin'), purchasDetailsController.getDataById);
router.post("/",protect,restrictTo("user",'admin'),purchasDetailsController.createPurchaseDetails);
router.put("/:id",protect,restrictTo('admin'),purchasDetailsController.updateData);
router.delete("/:id",protect,restrictTo('admin'),purchasDetailsController.deleteData);


module.exports = router;