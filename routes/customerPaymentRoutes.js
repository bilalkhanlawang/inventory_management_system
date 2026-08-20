const express = require ("express");
const router = express.Router();
const customerPaymentController = require("../controllers/customerPaymentController.js");

router.get("/",customerPaymentController.getALLData);
router.get("/:id",customerPaymentController.getDataById);
router.post("/",customerPaymentController.createData);
router.put("/:id",customerPaymentController.updateData);
router.delete("/:id",customerPaymentController.deleteData);




module.exports = router;