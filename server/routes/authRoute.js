const express = require("express");
const { signup, login, getLoggedUser, logout } = require("../controller/auth");
const { auth } = require("../middleware/AuthMiddleWare");

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.use(auth);

router.route("/loggedUser").get(getLoggedUser);
router.route("/logout").get(logout);

module.exports = router;
