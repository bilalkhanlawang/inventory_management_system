const express = require ("express");
const router = express.Router();
const purchasePaymentController = require("../controllers/purchasePaymentController.js");
const {protect} = require("../controllers/authController.js");
router.get("/",protect,purchasePaymentController.getAllData);
router.get("/:id" ,protect,purchasePaymentController.getDataById);
router.post("/",protect,purchasePaymentController.createData);
router.put("/:id",protect,purchasePaymentController.updateData);
router.delete("/:id",protect,purchasePaymentController.deleteData);


module.exports = router;