const express = require ("express");
const router = express.Router();
const unitsController = require("../controllers/unitsController");

router.get("/" , unitsController.getUnit);
router.get("/:id" ,unitsController.getUnitById);
router.post("/" , unitsController.createData);
router.put("/:id" , unitsController.updateData);
router.delete("/:id" ,unitsController.deleteData);





module.exports = router;