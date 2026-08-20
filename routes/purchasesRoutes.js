const express = require("express");
const router = express.Router();
const purchasesController = require("../controllers/purchasesController.js");

router.get("/",purchasesController.getAllData);
router.get("/:id",purchasesController.getPurchaseById);
router.post("/",purchasesController.createData);
router.put("/:id",purchasesController.updateData);
router.delete("/:id",purchasesController.deleteData);




module.exports = router;