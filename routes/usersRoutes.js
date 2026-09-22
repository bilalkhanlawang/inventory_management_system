const express = require ("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");
const { protect, restrictTo } = require("../controllers/authController.js");

router.get("/" ,protect,restrictTo("user",'admin'), usersController.getAllData);
router.get("/:id" ,protect,restrictTo("user",'admin'), usersController.getDataById);
router.post("/" ,protect,restrictTo("user",'admin'), usersController.createData);
router.patch("/:id" ,protect,restrictTo("user",'admin'), usersController.updateData);
router.delete("/:id" ,protect,restrictTo("user",'admin'), usersController.deleteUser);




module.exports = router;
