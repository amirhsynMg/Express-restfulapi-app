const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
// let users = require("../users");
///////////////////////////////////////////////////////////////////////////////////////
const User = require("../models/user");
const mongoose = require("mongoose");
///////////////////////////////////////////////////////////////////////////////////////
// all users api
router.get(
  "/",

  async (req, res) => {
    const users = await User.find({});
    res.json({
      data: users,
      message: "ok",
    });
  }
);
///////////////////////////////////////////////////////////////////////////////////////
// one user api
router.get(
  "/:id",

  async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("invalid id");
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({
        data: null,
        message: `Error no such user with ${req.params.id} id`,
      });

    res.json({
      data: user,
      message: "ok",
    });
  }
);
///////////////////////////////////////////////////////////////////////////////////////

// post api
router.post(
  "/",
  [
    body("email", "email not valid").isEmail(),
    body("first_name", "first name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        data: null,
        errors: errors.array(),
        message: "validation error!",
      });
    }
    let newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
    });
    newUser = await newUser.save();
    res.json({
      data: newUser,
      message: "All good",
    });
  }
);
///////////////////////////////////////////////////////////////////////////////////////
// put api

router.put(
  "/:id",
  [
    body("email", "email must be valid").isEmail(),
    body("first_name", "first name cant be empty").notEmpty(),
    body("last_name", "last name cant be empty").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        data: null,
        errors: errors.array(),
        message: "validation error!",
      });

    if(!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(400).send("the given id is not valid")

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
      },
      { new: true }
    );
    if (!user)
      return res.status(404).json({
        data: null,
        message: "There is no such user with the given id",
      });

    res.json({
      data: user,
      message: "All Good",
    });
  }
);

///////////////////////////////////////////////////////////////////////////////////////
// delete
router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user)
    return res
      .status(404)
      .json({ data: null, message: "There is no such user with the given id" });

  res.json({ data: user, message: "All Good" });
});

module.exports = router;
