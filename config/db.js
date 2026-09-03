const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");
  } catch (error) {
    console.log("Conntection Failed TO MongoDB!", error);
  }
}

module.exports = connectToDB;

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("Connected to MongoDB..."))
//   .catch((error) => console.log("Conntection Failed TO MongoDB!", error));
