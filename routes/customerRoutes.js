const express = require("express");
const router = express.Router();
const customersController = require("../controllers/customersController.js");

router.get("/" , customersController.getAllData);
router.get("/:id" , customersController.getDataById);
router.post("/" , customersController.createData);
router.put("/:id" , customersController.updateData);
router.delete("/:id", customersController.deleteData);



module.exports = router