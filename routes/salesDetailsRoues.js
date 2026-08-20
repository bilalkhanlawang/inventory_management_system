const express = require ("express");
const router = express.Router();
const salesDetailsController = require("../controllers/salesDetailsController.js");
router.get("/",salesDetailsController.getAllData);
router.get("/:id" , salesDetailsController.getDataById);
router.post("/",salesDetailsController.createData);
router.put("/:id",salesDetailsController.updateData);
router.delete("/:id",salesDetailsController.deleteData);


module.exports = router;