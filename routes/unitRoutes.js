const express = require ("express");
const router = express.Router();
const unitsController = require("../controllers/unitsController");
const {protect,restrictTo} = require("../controllers/authController.js");

router.get("/" ,protect ,restrictTo("user",'admin'),unitsController.getUnit);
router.get("/:id" ,protect,restrictTo("user",'admin'),unitsController.getUnitById);
router.post("/" ,protect,restrictTo("user",'admin'), unitsController.createData);
router.put("/:id" , protect,restrictTo('admin'),unitsController.updateData);
router.delete("/:id" ,protect,restrictTo('admin'),unitsController.deleteData);





module.exports = router;