const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    friends: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    requests: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    steamVanityUrl: {
      type: String,
      default: null,
    },
    steamId: {
      type: String,
      default: null,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
