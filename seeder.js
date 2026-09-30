const { Book } = require("./models/Book");
const { Author } = require("./models/Author");
const { authors } = require("./data");
const { books } = require("./data");
const connectToDB = require("./config/db");
require("dotenv").config();

// Connection To DataBase
connectToDB();

// Import Books
const importBooks = async () => {
  try {
    await Book.insertMany(books);
    console.log("Books Imported");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Import Authors
const importAuthors = async () => {
  try {
    await Author.insertMany(authors);
    console.log("Authors Imported");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Delete Books
const deleteBooks = async () => {
  try {
    await Book.deleteMany();
    console.log("Books Deleted");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Delete Authors
const deleteAuthors = async () => {
  try {
    await Author.deleteMany();
    console.log("Authors Deleted");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-import") {
  importBooks();
} else if (process.argv[2] === "-remove") {
  deleteBooks();
} else if (process.argv[2] === "-import-authors") {
  importAuthors();
} else if (process.argv[2] === "-remove-authors") {
  deleteAuthors();
}
