const express = require("express");
const router = express.Router();
const exchangeRate = require("../controllers/exchangeRateController.js");

router.get("/",exchangeRate.getALLData);
router.get("/:id",exchangeRate.getDataById);
router.post("/",exchangeRate.createData);
router.put("/:id",exchangeRate.updateData);
router.delete("/:id",exchangeRate.deleteData);



module.exports = router;