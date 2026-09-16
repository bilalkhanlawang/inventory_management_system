const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController.js");
const {protect,restrictTo} = require("../controllers/authController.js");

router.get("/",protect,restrictTo("user",'admin'),salesController.getAllSales);
router.get("/:id",protect,restrictTo("user",'admin'),salesController.getSaleById);
router.post("/",protect,restrictTo("user",'admin'),salesController.createSale);
router.put("/:id",protect,restrictTo('admin'),salesController.updateSale);
router.delete("/:id",protect,restrictTo('admin'),salesController.deleteSale);


module.exports = router;