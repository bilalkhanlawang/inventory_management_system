const express = require ("express");
const router = express.Router();
const categoryController = require("../controllers/categoriesController.js");
const { protect, restrictTo } = require("../controllers/authController.js");


router.get("/" ,protect,restrictTo("user",'admin'), categoryController.getCategories);
router.get("/:id" , protect,restrictTo("user",'admin'),categoryController.getCategoryById);
router.post("/",protect,restrictTo("user",'admin'),categoryController.createData);
router.put("/:id" ,protect,restrictTo('admin'), categoryController.updateCategory);
router.delete("/:id" ,protect,restrictTo('admin'),categoryController.deleteCategory);







module.exports = router;