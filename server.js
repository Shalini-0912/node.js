require("dotenv").config();


const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Add this line

app.use(cors());
app.use(express.static(__dirname));
app.use("/images", express.static(path.join(__dirname, "images")));

// ✅ MongoDB Connect (Atlas)
mongoose.connect(process.env.MONGO_URI, {
  
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection failed:", err));

// ✅ Schemas
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  feedback: String,
  problem: String,
  message: String
});
const Contact = mongoose.model("Contact", contactSchema);

const likedImageSchema = new mongoose.Schema({
  userId: String,
  productId: String,
  imageName: String,
  likedAt: { type: Date, default: Date.now }
});
const LikedImage = mongoose.model("LikedImage", likedImageSchema);

// ✅ LIKE an image
app.post("/like", async (req, res) => {
  const { userId, productId, imageName } = req.body;
  console.log("📩 Received Like Request:", req.body);

  try {
    const alreadyLiked = await LikedImage.findOne({ userId, productId, imageName });
    if (alreadyLiked) return res.json({ message: "Already liked" });

    const likedImage = new LikedImage({ userId, productId, imageName });
    await likedImage.save();

    console.log("✅ Saved new like:", likedImage);
    res.json({ message: "Liked image saved successfully!", likedImage });
  } catch (err) {
    console.error("❌ Error in Like API:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all liked images
app.get("/liked", async (req, res) => {
  try {
    const likedItems = await LikedImage.find();
    console.log("📤 Sending liked items:", likedItems);
    res.json(likedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get liked images for a user
app.get("/liked/:userId", async (req, res) => {
  try {
    const likedItems = await LikedImage.find({ userId: req.params.userId });
    console.log(`📤 Sending liked items for ${req.params.userId}:`, likedItems);
    res.json(likedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UNLIKE (remove like)
app.post("/unlike", async (req, res) => {
  const { id } = req.body;
  console.log("🗑 Received unlike request for ID:", id);

  try {
    const result = await LikedImage.deleteOne({ _id: id });
    console.log("🔍 MongoDB delete result:", result);

    if (result.deletedCount > 0) {
      res.json({ message: "Like removed successfully!" });
    } else {
      res.status(404).json({ error: "Like not found" });
    }
  } catch (err) {
    console.error("❌ Error in /unlike route:", err);
    res.status(500).json({ error: err.message });
  }
});




// ✅ Contact form
app.post("/contact", async (req, res) => {
  console.log("📩 Received contact form data:", req.body); // 🔍 Debug

  try {
    const contact = new Contact(req.body);
    await contact.save();
    console.log("✅ Saved contact:", contact); // 🔍 Debug
    res.json({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error("❌ Error saving contact:", err);
    res.status(500).json({ error: err.message });
  }
});


app.get("/contact", async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Pages
app.get("/collection", (req, res) => res.sendFile(path.join(__dirname, "collection.html")));
app.get("/liked-page", (req, res) => res.sendFile(path.join(__dirname, "liked.html")));

// ✅ Buy (Dummy Checkout)
app.post("/buy", (req, res) => {
  const { productId } = req.body;
  const checkoutUrl = `${req.protocol}://${req.get("host")}/checkout?product=${productId}`;
   res.json({ checkoutUrl }); 

});

app.get("/checkout", (req, res) => {
  res.send(`<h1>Checkout for ${req.query.product}</h1><button>Pay</button>`);
});

// ✅ Dynamic Port for Deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));