const express = require("express");
const router = express.Router();
// for /
router.get("/", (req, res) => {
  res.render("home", { name: "amir" });
});

module.exports = router;
