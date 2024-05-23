const express = require("express");
const { signup, login, getLoggedUser, logout } = require("../controller/auth");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/loggedUser").get(getLoggedUser);
router.route("/logout").get(logout);

module.exports = router;
