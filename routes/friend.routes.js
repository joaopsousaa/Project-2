const router = require("express").Router();

// Models
const UserModel = require("../models/User.model");

// Middlewares
const isLoggedIn = require("../middleware/isLoggedIn");
const ifUserExists = require("../middleware/ifUserExists");

// ---------------------- Router Configs ---------------------- //
router.use(isLoggedIn);
router.use(ifUserExists);

// ---------------------- Routes ------------------------------ //

//* Friend Requests

// GET /:friendId/add --> Send a friend request to a user
router.get("/:friendId/add", (req, res) => {
  const { friendId } = req.params;
  const { userId } = req.session;

  if (friendId === userId) return res.status(400).redirect("/");

  UserModel.findById(friendId)
    .then((friend) => {
      if (!friend) return res.status(400).redirect("/");
      if (friend.friends.includes(userId) || friend.requests.includes(userId))
        return res.status(400).redirect("/");

      UserModel.findByIdAndUpdate(
        {
          _id: friend._id,
        },
        {
          $push: {
            requests: userId,
          },
        },
        { new: true }
      ).then((request) => {
        return res.status(200).redirect("/");
      });
    })
    .catch((err) => {
      console.log("err:", err);
      return res.status(500).redirect("/");
    });
});

// GET /:friendId/cancel --> Cancel the friend request sent
router.get("/:friendId/cancel", (req, res) => {
  const { friendId } = req.params;
  const { userId } = req.session;

  if (friendId === userId) return res.status(400).redirect("/");

  UserModel.findById(friendId)
    .then((friend) => {
      if (!friend) return res.status(400).redirect("/");
      if (!friend.requests.includes(userId))
        return res.status(400).redirect("/");

      UserModel.findByIdAndUpdate(
        {
          _id: friend._id,
        },
        {
          $pull: {
            requests: userId,
          },
        },
        { new: true }
      ).then((request) => {
        return res.status(200).redirect("/");
      });
    })
    .catch((err) => {
      console.log("err:", err);
      return res.status(500).redirect("/");
    });
});

//* Friend Requests Actions

// GET /:friendId/accept --> Accept a friend request
router.get("/:friendId/accept", (req, res) => {
  const { friendId } = req.params;
  const { user } = req;

  if (friendId === user._id) return res.status(400).redirect("/");

  if (!user.requests.includes(friendId)) return res.status(400).redirect("/");

  UserModel.findByIdAndUpdate(
    {
      _id: user._id,
    },
    {
      $push: {
        friends: friendId,
      },
      $pull: {
        requests: friendId,
      },
    },
    { new: true }
  )
    .then((user) => {
      console.log("user:", user);
      UserModel.findByIdAndUpdate(
        {
          _id: friendId,
        },
        {
          $push: {
            friends: user._id,
          },
        },
        { new: true }
      ).then((friend) => {
        console.log("friend:", friend);
        return res.status(200).redirect("/");
      });
    })
    .catch((err) => {
      console.log("err:", err);
      return res.status(500).redirect("/");
    });
});

// GET /:friendId/decline --> Decline a friend request

router.get("/:friendId/decline", (req, res) => {
  const { friendId } = req.params;
  const { user } = req;

  if (friendId === user._id) return res.status(400).redirect("/");

  if (!user.requests.includes(friendId)) return res.status(400).redirect("/");

  UserModel.findByIdAndUpdate(
    {
      _id: user._id,
    },
    {
      $pull: {
        requests: friendId,
      },
    },
    { new: true }
  )
    .then((user) => {
      return res.status(200).redirect("/");
    })
    .catch((err) => {
      console.log("err:", err);
      return res.status(500).redirect("/");
    });
});

//* Friendlist Actions

// GET /:friendId/remove --> Remove a friend from the friendlist
router.get("/:friendId/remove", (req, res) => {
  const { friendId } = req.params;
  const { user } = req;

  if (friendId === user._id) return res.status(400).redirect("/");

  if (!user.friends.includes(friendId)) return res.status(400).redirect("/");

  UserModel.findByIdAndUpdate(
    {
      _id: user._id,
    },
    {
      $pull: {
        friends: friendId,
      },
    },
    { new: true }
  )
    .then((user) => {
      UserModel.findByIdAndUpdate(
        {
          _id: friendId,
        },
        {
          $pull: {
            friends: user._id,
          },
        },
        { new: true }
      ).then((friend) => {
        return res.status(200).redirect("/");
      });
    })
    .catch((err) => {
      console.log("err:", err);
      return res.status(500).redirect("/");
    });
});

// ------------------------------------------------------------ //
module.exports = router;
