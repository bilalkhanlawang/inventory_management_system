const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController.js");
const {protect} = require("../controllers/authController.js");

router.get("/",protect,salesController.getAllSales);
router.get("/:id",protect,salesController.getSaleById);
router.post("/",protect,salesController.createSale);
router.put("/:id",protect,salesController.updateSale);
router.delete("/:id",protect,salesController.deleteSale);


module.exports = router;