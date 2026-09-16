const express = require ("express");
const router = express.Router();
const currenciesController = require ("../controllers/currenciesController.js");
const {protect ,restrictTo} = require("../controllers/authController.js");

router.get("/" ,protect,restrictTo("user",'admin'), currenciesController.getAllData);
router.get("/:id",protect,restrictTo("user",'admin'),  currenciesController.getCategoriesById);
router.post("/",protect, restrictTo("user",'admin'),currenciesController.createDataCurrency);
router.put("/:id" ,protect, restrictTo('admin'), currenciesController.updateData);
router.delete("/:id" ,protect, restrictTo('admin'), currenciesController.deleteData);





module.exports = router;