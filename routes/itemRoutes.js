const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemsController.js");

router.get("/",itemController.getAllData);
router.get("/:id",itemController.getItemByIy);
router.post("/",itemController.createData);
router.put("/:id",itemController.updateItem);
router.delete("/:id",itemController.deleteItem);



module.exports = router;