const express = require ("express");
const router = express.Router();
const salesDetailsController = require("../controllers/salesDetailsController.js");
const {protect,restrictTo} = require("../controllers/authController.js");

router.get("/",protect,restrictTo("user",'admin'),salesDetailsController.getAllData);
router.get("/:id" ,protect,restrictTo("user",'admin'), salesDetailsController.getDataById);
router.post("/",protect,restrictTo("user",'admin'),salesDetailsController.createData);
router.put("/:id",protect,restrictTo('admin'),salesDetailsController.updateData);
router.delete("/:id",protect,restrictTo('admin'),salesDetailsController.deleteData);


module.exports = router;




