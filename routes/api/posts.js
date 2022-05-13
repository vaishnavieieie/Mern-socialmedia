const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/Users");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const { request } = require("express");

//@route  POST api/posts
//@desc   Create post
//@access Private

router.post(
  "/",
  [auth, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });
      const post = await newPost.save();
      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  GET api/posts
//@desc   Get all post
//@access Private

router.get("/", auth, async (req, res) => {
  try {
    const allPost = await Post.find().sort({ date: -1 });
    if (!allPost) {
      //error

      return res.status(400).json({ msg: "Posts not found:(" });
    }
    res.json(allPost);
  } catch (err) {
    console.error(err.message);

    res.status(500).send("Server Error");
  }
});

//@route  GET api/posts/:post_id
//@desc   Get post by id
//@access Private

router.get("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.post_id });
    if (!post) {
      return res.status(400).json({ msg: "Post not found:(" });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if ((err.kind = "ObjectId")) {
      return res.status(400).json({ msg: "Posts not found:(" });
    }
    res.status(500).send("Server Error");
  }
});

//@route  DELETE api/posts/:post_id
//@desc   Get post by id and delete
//@access Private

router.delete("/:post_id", auth, async (req, res) => {
  try {
    const removePost = await Post.findById(req.params.post_id);
    if (!removePost) {
      return res.status(400).json({ msg: "Post not found:(" });
    }
    //check if user is deleting own post
    if (removePost.user.toString() != req.user.id) {
      return res.status(400).json({ msg: "User not authorized" });
    } else {
      removePost.remove();
    }
    res.send("Post Deleted");
  } catch (err) {
    console.error(err.message);
    if ((err.kind = "ObjectId")) {
      return res.status(400).json({ msg: "Posts not found:(" });
    }
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/posts/like/:post_id
//@desc   Like post
//@access Private

router.put("/like/:post_id", auth, async (req, res) => {
  try {
    //get post
    const post = await Post.findById(req.params.post_id);
    //check if liked
    // const like = await post.likes.find((x) => (x.user = req.user.id));
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id).length >
      0
    ) {
      return res.status(400).send("Post already liked");
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/posts/unlike/:post_id
//@desc   unLike post
//@access Private

router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    //get post
    const post = await Post.findById(req.params.post_id);
    //check if liked
    // const like = await post.likes.filter((x) => x.user.toString == req.user.id);
    // if (like) {
    //   return res.send("Post is liked");
    // } else {
    //   return res.send("Post is not liked");
    // }
    if (
      post.likes.filter((like) => like.user.toString() == req.user.id)
        .length === 0
    ) {
      return res.status(400).send("Post has not been liked");
    } else {
      const removeI = post.likes.indexOf({ user: req.user.id });
      post.likes.splice(removeI, 1);
      await post.save();
    }

    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route  PUT api/posts/comment/:post_id
//@desc   comment on a post
//@access Private
router.put(
  "/comment/:post_id",
  [auth, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");

      const post = await Post.findById(req.params.post_id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route  DELETE api/posts/uncomment/:post_id
//@desc   remove comment from a post
//@access Private

router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      return res.status(400).json({ msg: "Post not found:(" });
    }
    const removeI = await post.comments.indexOf({ id: req.params.comment_id });
    post.comments.splice(removeI, 1);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if ((err.kind = "ObjectId")) {
      return res.status(400).json({ msg: "Posts not found:(" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
