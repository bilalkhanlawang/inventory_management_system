const express = require("express");
const router = express.Router();
const exchangeRate = require("../controllers/exchangeRateController.js");
const {protect} = require("../controllers/authController.js");
router.get("/",protect,exchangeRate.getALLData);
router.get("/:id",protect,exchangeRate.getDataById);
router.post("/",protect,exchangeRate.createData);
router.put("/:id",protect,exchangeRate.updateData);
router.delete("/:id",protect,exchangeRate.deleteData);



module.exports = router;