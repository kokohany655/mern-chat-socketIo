const express = require("express");
const {
  getAllUsers,
  createUser,
  getOneUser,
  updateUser,
  deleteUser,
  searchUser,
} = require("../controller/user");
const { auth } = require("../middleware/AuthMiddleWare");

const router = express.Router();

router.use(auth);

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getOneUser).put(updateUser).delete(deleteUser);

router.route("/search-user").post(searchUser);

module.exports = router;
