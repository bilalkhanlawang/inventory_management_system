const express = require ("express");
const router = express.Router();
const categoryController = require("../controllers/categoriesController.js");


router.get("/" , categoryController.getCategories);
router.get("/:id" , categoryController.getCategoryById);
router.post("/",categoryController.createData);
router.put("/:id" , categoryController.updateCategory);
router.delete("/:id" ,categoryController.deleteCategory);







module.exports = router;