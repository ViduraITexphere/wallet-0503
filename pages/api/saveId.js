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

  // Find the document in MongoDB with the matching discordId and update or create it
  let doc = await MyModel.findOneAndUpdate(
    { discordId: idFromPath },
    { walletAddress },
    { upsert: true, new: true }
  );

  // Return the saved document
  res.status(200).json(doc);
}

export default saveId;
