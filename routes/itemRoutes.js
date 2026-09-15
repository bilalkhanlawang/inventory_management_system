const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemsController.js");
const {protect} = require("../controllers/authController.js");
router.get("/",protect,itemController.getAllData);
router.get("/:id",protect,itemController.getItemByIy);
router.post("/",protect,itemController.createData);
router.put("/:id",protect,itemController.updateItem);
router.delete("/:id",protect,itemController.deleteItem);



module.exports = router;