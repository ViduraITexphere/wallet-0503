const mongoose = require("mongoose");

// Define a Mongoose schema for your collection
const mySchema = new mongoose.Schema({
  discordId: String,
  cosmoWalletAddress: String,
  metamaskWalletAddress: String,
});

// Define a Mongoose model for your collection
module.exports = mongoose.model("users", mySchema);
