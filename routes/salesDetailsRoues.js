const express = require ("express");
const router = express.Router();
const salesDetailsController = require("../controllers/salesDetailsController.js");
const {protect} = require("../controllers/authController.js");

router.get("/",protect,salesDetailsController.getAllData);
router.get("/:id" ,protect, salesDetailsController.getDataById);
router.post("/",protect,salesDetailsController.createData);
router.put("/:id",protect,salesDetailsController.updateData);
router.delete("/:id",protect,salesDetailsController.deleteData);


module.exports = router;