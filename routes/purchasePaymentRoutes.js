const express = require ("express");
const router = express.Router();
const purchasePaymentController = require("../controllers/purchasePaymentController.js");
const {protect,restrictTo} = require("../controllers/authController.js");
router.get("/",protect,restrictTo("user",'admin'),purchasePaymentController.getAllData);
router.get("/:id" ,protect,restrictTo("user",'admin'),purchasePaymentController.getDataById);
router.post("/",protect,restrictTo("user",'admin'),purchasePaymentController.createData);
router.put("/:id",protect,restrictTo('admin'),purchasePaymentController.updateData);
router.delete("/:id",protect,restrictTo('admin'),purchasePaymentController.deleteData);


module.exports = router;