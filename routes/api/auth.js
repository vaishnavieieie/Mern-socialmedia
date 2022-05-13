const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

//@route GET api/auth
//@desc test route
//@access private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    console.log(err.message);
    res.status(500).send("Server error");
  }
});

//@route POST api/auth
//@desc authenticate/login user and get token
//@access public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter password").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      //check if user exists
      if (!user) {
        res.status(400).json({ errors: [{ msg: "Invalid credentials!" }] });
      }

      //check if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(400).json({ errors: [{ msg: "Invalid credentials!" }] });
      }

      //return token
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecretToken"),
        {
          expiresIn: 36000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).json("Server error");
    }
  }
);

module.exports = router;
