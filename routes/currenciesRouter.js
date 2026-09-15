const express = require ("express");
const router = express.Router();
const currenciesController = require ("../controllers/currenciesController.js");
const {protect} = require("../controllers/authController.js");
router.get("/" ,protect, currenciesController.getAllData);
router.get("/:id",protect,  currenciesController.getCategoriesById);
router.post("/",protect, currenciesController.createDataCurrency);
router.put("/:id" ,protect,  currenciesController.updateData);
router.delete("/:id" ,protect,  currenciesController.deleteData);





module.exports = router;