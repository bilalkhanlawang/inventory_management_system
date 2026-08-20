const express = require ("express");
const router = express.Router();
const purchasDetailsController = require("../controllers/parchaseDetailsController.js");

router.get("/",purchasDetailsController.getALLData);
router.get("/:id" , purchasDetailsController.getDataById);
router.post("/",purchasDetailsController.createPurchaseDetails);
router.put("/:id",purchasDetailsController.updateData);
router.delete("/:id",purchasDetailsController.deleteData);


module.exports = router;