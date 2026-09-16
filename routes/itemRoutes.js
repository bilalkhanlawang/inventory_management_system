const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemsController.js");
const {protect,restrictTo} = require("../controllers/authController.js");
router.get("/",protect,restrictTo("user",'admin'),itemController.getAllData);
router.get("/:id",protect,restrictTo("user",'admin'),itemController.getItemByIy);
router.post("/",protect,restrictTo("user",'admin'),itemController.createData);
router.put("/:id",protect,restrictTo('admin'),itemController.updateItem);
router.delete("/:id",protect,restrictTo('admin'),itemController.deleteItem);



module.exports = router;