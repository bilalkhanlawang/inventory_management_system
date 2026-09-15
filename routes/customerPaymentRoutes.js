const express = require ("express");
const router = express.Router();
const customerPaymentController = require("../controllers/customerPaymentController.js");
const {protect} = require("../controllers/authController.js");

router.get("/",protect,customerPaymentController.getALLData);
router.get("/:id",protect,customerPaymentController.getDataById);
router.post("/",protect,customerPaymentController.createData);
router.put("/:id",protect,customerPaymentController.updateData);
router.delete("/:id",protect,customerPaymentController.deleteData);




module.exports = router;