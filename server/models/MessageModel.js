const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: String,
    imageUrl: String,
    videoUrl: String,
    seen: Boolean,
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

exports.Message = mongoose.model("Message", messageSchema);
