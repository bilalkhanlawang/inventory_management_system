const express = require("express");
const router = express.Router();
const purchasesController = require("../controllers/purchasesController.js");
const {protect,restrictTo} = require("../controllers/authController.js");
router.get("/",protect,restrictTo("user",'admin'),purchasesController.getAllData);
router.get("/:id",protect,restrictTo("user",'admin'),purchasesController.getPurchaseById);
router.post("/",protect,restrictTo("user",'admin'),purchasesController.createData);
router.put("/:id",protect,restrictTo('admin'),purchasesController.updateData);
router.delete("/:id",protect,restrictTo('admin'),purchasesController.deleteData);




module.exports = router;