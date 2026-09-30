const Joi = require("joi");
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      minlength: 5,
    },
    price: {
      type: Number,
      trim: true,
      min: 0,
      required: true,
    },
    cover: {
      type: String,
      required: true,
      enum: ["soft cover", "hard cover"],
    },
  },
  {
    timestamps: true,
  },
);

// Validate Create Book
function validateCreateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(50).required(),
    author: Joi.string().required(),
    description: Joi.string().trim().min(3).required(),
    price: Joi.number().min(0).required(),
    cover: Joi.string().valid("soft cover", "hard cover").required(),
  });
  return schema.validate(obj);
}

// Validate Update Book
function validateUpdateBook(obj) {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).max(50),
    author: Joi.string(),
    description: Joi.string().trim().min(3),
    price: Joi.number().min(0),
    cover: Joi.string().valid("soft cover", "hard cover"),
  });

  return schema.validate(obj);
}

const Book = mongoose.model("Book", BookSchema);

module.exports = {
  Book,
  validateCreateBook,
  validateUpdateBook,
};
