const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: String,
    imageUrl: String,
    videoUrl: String,
    seen: Boolean,
  },
  {
    timestamps: true,
  }
);

exports.Message = mongoose.model("Message", messageSchema);
