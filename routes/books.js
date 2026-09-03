const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken")
const {Book , validateCreateBook , validateUpdateBook} = require("../models/Book");



/**
 * @desc    Get All Books
 * @route   /api/books
 * @method  GET
 * @access  public
 */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const bookList = await Book.find().populate("author");
    res.status(200).json(bookList);
  }),
);



/**
 * @desc    Get Book By Id
 * @route   /api/books/:id
 * @method  GET
 * @access  public
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id).populate("author");
    if (!book) {
      res.status(404).json({ message: "Book Not Found" });
    } else {
      res.status(200).json(book);
    }
  }),
);



/**
 * @desc    Create new book
 * @route   /api/books
 * @method  POST
 * @access   private (Only Admin)
 */

router.post(
  "/",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateCreateBook(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });

    const result = await book.save();
    res.status(201).json(result);
  }),
);



/**
 * @desc    Updata A Book
 * @route   /api/books/:id
 * @method  PUT
 * @access   private (Only Admin)
 */

router.put(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const updateBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      {
        new: true,
      },
    );
    if (!updateBook){
      return res.status(404).json({message : "Book not Found"})
    } 
    res.status(200).json(updateBook);
  }),
);




/**
 * @desc    Delete A Book
 * @route   /api/books/:id
 * @method  DELETE
 * @access   private (Only Admin)
 */

router.delete(
  "/:id",
  verifyTokenAndAdmin,
  asyncHandler(async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book) {
      res.status(200).json({ message: "Book has been Deleted Succesfully !" });
    } else {
      res.status(404).json({ message: "Book not Found" });
    }
  }),
);



module.exports = router;
