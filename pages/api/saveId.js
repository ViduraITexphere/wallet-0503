import MyModel from "../../models/MyModel";
const mongoose = require("mongoose");

const connection = {};

async function saveId(req, res) {
  const { idFromPath, walletAddress } = req.body;
  console.log("walletAddress : 🥺 ", walletAddress);
  console.log("idFromPath : 🥺 ", idFromPath);

  // Connect to MongoDB if not already connected
  if (!connection.isConnected) {
    connection.isConnected = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  // Find the document in MongoDB with the matching discordId
  let doc = await MyModel.findOne({ discordId: idFromPath });

  if (doc) {
    // If a document is found, save wallet address to the document
    try {
      doc.discordId = walletAddress;
      await doc.save();
    } catch (err) {
      console.error("Error saving wallet address:", err);
      res.status(500).json({ error: "Error saving wallet address" });
      return;
    }
  } else {
    // If a document is not found, create a new document with the discordId and wallet address
    doc = await MyModel.create({
      discordId: idFromPath,
      walletAddress,
    });
  }

  // Return the saved document
  res.status(200).json(doc);
}

export default saveId;
