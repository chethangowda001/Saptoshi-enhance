const express = require("express");
const router = express.Router();
const {addUser,signin} = require("../controllers/AdminUsersController");

router.post("/signUp", addUser);
router.post("/signin",signin)

module.exports = router;