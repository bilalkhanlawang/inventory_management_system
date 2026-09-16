const express = require("express");
const router = express.Router();
const exchangeRate = require("../controllers/exchangeRateController.js");
const {protect,restrictTo} = require("../controllers/authController.js");
router.get("/",protect,restrictTo("user",'admin'),exchangeRate.getALLData);
router.get("/:id",protect,restrictTo("user",'admin'),exchangeRate.getDataById);
router.post("/",protect,restrictTo("user",'admin'),exchangeRate.createData);
router.put("/:id",protect,restrictTo('admin'),exchangeRate.updateData);
router.delete("/:id",protect,restrictTo('admin'),exchangeRate.deleteData);



module.exports = router;