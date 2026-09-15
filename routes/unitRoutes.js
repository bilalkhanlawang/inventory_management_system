const express = require ("express");
const router = express.Router();
const unitsController = require("../controllers/unitsController");
const {protect} = require("../controllers/authController.js");

router.get("/" ,protect ,unitsController.getUnit);
router.get("/:id" ,protect,unitsController.getUnitById);
router.post("/" ,protect, unitsController.createData);
router.put("/:id" , protect,unitsController.updateData);
router.delete("/:id" ,protect,unitsController.deleteData);





module.exports = router;