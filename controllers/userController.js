const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const { User, validateUpdateUser } = require("../models/User");

/**
 * @desc     Upadate User
 * @route    /api/users/:id
 * @method   PUT
 * @access   private
 */
const updateAnUser = asyncHandler(async (req, res) => {
  const { error } = validateUpdateUser(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  console.log(req.headers);

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }

  const updateUser = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      },
    },
    { new: true },
  ).select("-password");
  res.status(200).json(updateUser);
});

/**
 * @desc     Get All Users
 * @route    /api/users
 * @method   GET
 * @access   private (only Admin)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const userList = await User.find().select("-password");
  res.status(200).json(userList);
});

/**
 * @desc     Get User by id
 * @route    /api/users/:id
 * @method   GET
 * @access   private (only Admin and User himself)
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User Not found" });
  }
});

/**
 * @desc     Deletet User
 * @route    /api/users/:id
 * @method   DELETE
 * @access   private (only Admin and User himself)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User Has been deleted succesfully !" });
  } else {
    res.status(404).json({ message: "User Not found" });
  }
});

module.exports = {
  updateAnUser,
  getAllUsers,
  getUserById,
  deleteUser,
};
