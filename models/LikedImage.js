// models/LikedImage.js
const likeConnection = mongoose.createConnection("mongodb://127.0.0.1:27017/likeDB");
const LikedImage = likeConnection.model("LikedImage", likedImageSchema);
module.exports = LikedImage;

