const express = require ("express");
const router = express.Router();
const currenciesController = require ("../controllers/currenciesController.js");

router.get("/" ,currenciesController.getAllData);
router.get("/:id", currenciesController.getCategoriesById);
router.post("/",currenciesController.createDataCurrency);
router.put("/:id" , currenciesController.updateData);
router.delete("/:id" , currenciesController.deleteData);





module.exports = router;