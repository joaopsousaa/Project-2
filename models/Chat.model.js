const { Schema, model } = require("mongoose");

const ChatSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", ChatSchema);

module.exports = Chat;
