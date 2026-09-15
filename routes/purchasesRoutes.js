const express = require("express");
const router = express.Router();
const purchasesController = require("../controllers/purchasesController.js");
const {protect} = require("../controllers/authController.js");
router.get("/",protect,purchasesController.getAllData);
router.get("/:id",protect,purchasesController.getPurchaseById);
router.post("/",protect,purchasesController.createData);
router.put("/:id",protect,purchasesController.updateData);
router.delete("/:id",protect,purchasesController.deleteData);




module.exports = router;