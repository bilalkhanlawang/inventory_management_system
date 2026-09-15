const express = require ("express");
const router = express.Router();
const categoryController = require("../controllers/categoriesController.js");
const { protect } = require("../controllers/authController.js");


router.get("/" ,protect, categoryController.getCategories);
router.get("/:id" , protect,categoryController.getCategoryById);
router.post("/",protect,categoryController.createData);
router.put("/:id" ,protect, categoryController.updateCategory);
router.delete("/:id" ,protect,categoryController.deleteCategory);







module.exports = router;