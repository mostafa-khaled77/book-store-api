const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {
  getAllAuthors,
  getAuthorsById,
  createAuthor,
  updateAnAuthor,
  deleteAuthor,
} = require("../controllers/authorController");

// /api/authors/
router.route("/").get(getAllAuthors).post(verifyTokenAndAdmin, createAuthor);

// /api/authors/:id
router
  .route("/:id")
  .get(getAuthorsById)
  .put(verifyTokenAndAdmin, updateAnAuthor)
  .delete(verifyTokenAndAdmin, deleteAuthor);

module.exports = router;
