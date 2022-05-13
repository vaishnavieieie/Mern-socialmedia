const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/Users");
const { check, validationResult } = require("express-validator");
const normalize = require("normalize-url");
const axios = require("axios");
const config = require("config");
const Post = require("../../models/Post");

//@route GET api/profile/me
//@desc get current user profile
//@access private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user:(" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route POST api/profile
//@desc create or update profile
//@access private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").notEmpty(),
      check("skills", "Skills is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      githubusername,
      company,
      location,
      bio,
      status,
    } = req.body;

    //build profile fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) {
      profileFields.website =
        website !== "" ? normalize(website, { forceHttps: true }) : "";
    }
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
      profileFields.skills = skills
        .toString()
        .split(",")
        .map((skill) => skill.trim());
    }

    //build social object
    profileFields.social = {};
    if (instagram) profileFields.social.instagram = instagram;
    if (youtube) profileFields.social.youtube = youtube;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;

    // for (const [key, value] of Object.entries(socialFields)) {
    //   if (value && value.length > 0)
    //     socialFields[key] = normalize(value, { forceHttps: true });
    // }

    try {
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route GET api/profile
//@desc get all profiles
//@access public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles) {
      return res.status(400).json({ msg: "No profiles found:(" });
    }
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route GET api/profile/user/:user_id
//@desc get profile by id
//@access public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profiles = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profiles) {
      return res.status(400).json({ msg: "Profile not found:(" });
    }
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "objectId") {
      return res.status(500).json({ msg: "Profile not found:(" });
    }
    res.status(500).send("Server error");
  }
});

//@route DELETE api/profile
//@desc delete profile
//@access private
router.delete("/", auth, async (req, res) => {
  try {
    //@todo-remove posts
    await Post.deleteMany({ user: req.user.id });
    //remove profile
    await Profile.findOneAndDelete({ user: req.user.id });

    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route PUT api/profile/experience
//@desc add experience
//@access private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").notEmpty(),
      check("company", "Company is required").notEmpty(),
      check("from", "From is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, from, to, current, description, location } =
      req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExperience);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route DELETE api/profile/experience/:exp_id
//@desc delete experience
//@access private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    //remove profile
    let profile = await Profile.findOne({ user: req.user.id });
    //get exp index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//education
//@route PUT api/profile/education
//@desc add education
//@access private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").notEmpty(),
      check("degree", "Degree is required").notEmpty(),
      check("fieldofstudy", "Fieldofstudy is required").notEmpty(),
      check("from", "From is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEducation = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEducation);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route DELETE api/profile/education/:edu_id
//@desc delete education
//@access private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    //remove profile
    let profile = await Profile.findOne({ user: req.user.id });
    //get exp index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//@route GET api/profile/github/:username
//@desc get github repos
//@access public
router.get("/github/:username", async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );

    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${config.get("githubToken")}`,
    };
    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: "No Github profile found" });
  }
});

module.exports = router;
