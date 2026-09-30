const asyncHandler = require("express-async-handler");
const {
  Author,
  createNewAuthor,
  updateNewAuthor,
} = require("../models/Author");

/**
 * @desc    Get All Users
 * @route   /api/authors
 * @method  GET
 * @access  public
 */
const getAllAuthors = asyncHandler(async (req, res) => {
  let authorList;
  const { pageNumber } = req.query;
  let authorsPerPage = 2;
  if (pageNumber) {
    authorList = await Author.find()
      .skip((pageNumber - 1) * authorsPerPage)
      .limit(authorsPerPage);
  } else {
    authorList = await Author.find();
  }
  res.status(200).json(authorList);
});

/**
 * @desc    Get Authors By Id
 * @route   /api/authors/:id
 * @method  GET
 * @access  public
 */
const getAuthorsById = asyncHandler(async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (!author) {
    return res.status(404).json({ message: "Author Not Found" });
  } else {
    res.status(200).json(author);
  }
});

/**
 * @desc    Create New Author
 * @route   /api/authors
 * @method  POST
 * @access  private (Only Admin)
 */
const createAuthor = asyncHandler(async (req, res) => {
  const { error } = createNewAuthor(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const author = new Author({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    nationality: req.body.nationality,
    image: req.body.image,
  });

  const result = await author.save();
  res.status(201).json(result);
});

/**
 * @desc      Update An Author
 * @route     /api/authors/:id
 * @method    PUT
 * @access     private (Only Admin)
 */
const updateAnAuthor = asyncHandler(async (req, res) => {
  const { error } = updateNewAuthor(req.body);
  console.log(error);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const updateAuthor = await Author.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nationality: req.body.nationality,
        image: req.body.image,
      },
    },
    { new: true },
  );
  if (!updateAuthor) {
    return res.status(404).json({ message: "Author Not Found" });
  }
  res.status(200).json(updateAuthor);
});

/**
 * @desc    Delete An Author
 * @route   /api/authors/:id
 * @method  DELETE
 * @access   private (Only Admin)
 */
const deleteAuthor = asyncHandler(async (req, res) => {
  const author = await Author.findByIdAndDelete(req.params.id);
  if (author) {
    res.status(200).json({ message: "Author has been Deleted Succesfully!" });
  } else {
    res.status(404).json({ message: "Author not found!" });
  }
});

module.exports = {
  getAllAuthors,
  getAuthorsById,
  createAuthor,
  updateAnAuthor,
  deleteAuthor,
};
