const express = require ("express");
const router = express.Router();
const customerPaymentController = require("../controllers/customerPaymentController.js");
const {protect, restrictTo} = require("../controllers/authController.js");

router.get("/",protect,restrictTo("user",'admin'),customerPaymentController.getALLData);
router.get("/:id",protect,restrictTo("user",'admin'),customerPaymentController.getDataById);
router.post("/",protect,restrictTo("user",'admin'),customerPaymentController.createData);
router.put("/:id",protect,restrictTo('admin'),customerPaymentController.updateData);
router.delete("/:id",protect,restrictTo('admin'),customerPaymentController.deleteData);




module.exports = router;