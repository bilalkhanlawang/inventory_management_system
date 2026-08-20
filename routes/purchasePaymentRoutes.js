const express = require ("express");
const router = express.Router();
const purchasePaymentController = require("../controllers/purchasePaymentController.js");
router.get("/",purchasePaymentController.getAllData);
router.get("/:id" ,purchasePaymentController.getDataById);
router.post("/",purchasePaymentController.createData);
router.put("/:id",purchasePaymentController.updateData);
router.delete("/:id",purchasePaymentController.deleteData);


module.exports = router;