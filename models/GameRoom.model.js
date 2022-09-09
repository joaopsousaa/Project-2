const { Schema, model } = require("mongoose");

const GameRoomSchema = new Schema(
  {
    name: {
      type: String,
    },
    game: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.ObjectId,
      required: true,
    },
    players: [
      {
        type: Schema.ObjectId,
      },
    ],
    minPlayers: {
      type: Number,
      min: 2,
      required: true,
    },
    maxPlayers: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "playing", "finished"],
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
);

const GameRoom = model("GameRoom", GameRoomSchema);

module.exports = GameRoom;
/*

!name === username's Game Room

createGameRoom --> name: name || username's Game Room;

*/
