const express = require("express");
const {
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser,
} = require("../controller/user");

const router = express.Router();

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getOneUser).put(updateUser).delete(deleteUser);

module.exports = router;
