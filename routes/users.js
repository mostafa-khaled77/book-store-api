const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middlewares/verifyToken");
const {
  updateAnUser,
  getAllUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

//    /api/users
router.route("/").get(verifyTokenAndAdmin, getAllUsers);

//   /api/users/:id
router
  .route("/:id")
  .put(verifyTokenAndAuthorization, updateAnUser)
  .get(verifyTokenAndAuthorization, getUserById)
  .delete(verifyTokenAndAuthorization, deleteUser);

module.exports = router;
