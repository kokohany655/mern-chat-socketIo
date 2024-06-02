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

router.route("/").get(getAllUsers).post(createUser);

router
  .route("/:id")
  .get(getOneUser)
  .put(auth, updateUser)
  .delete(auth, deleteUser);

router.route("/search-user").post(searchUser);

module.exports = router;
