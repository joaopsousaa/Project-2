const { Schema, model } = require("mongoose");

const ChatSchema = new Schema(
  {
    // gameRoomId: {
    //   type: Schema.ObjectId,
    //   //   required: true,
    // },
    // userId: {
    //   type: Schema.ObjectId,
    //   //   required: true,
    // },
    // message: {
    //   type: String,
    //   required: true,
    // },
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

const Chat = model("ChatModel", ChatSchema);

module.exports = Chat;
