const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const { Reply, validateReply } = require("../models/replies");
const _ = require("lodash");
const { Post } = require("../models/post");
const router = express.Router();

router.post("/create/:id", fetchuser, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
  } catch (ex) {
    return res.status(400).send("The Post with given ID doesn't exists!");
  }
  const { error } = validateReply(req.body);
  if (error) res.status(400).send(error.details[0].message);
  const reply = new Reply({
    post: req.params.id,
    comment: req.body.comment,
    user: req.user.id,
  });
  try {
    await reply.save();
    const reply_populated = await Reply.find({ _id: reply._id }).populate(
      "user",
      "name -_id"
    );
    res.send(reply_populated);
  } catch (ex) {
    console.log("error: ", ex);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
  } catch (ex) {
    return res.status(400).send("The Post with given ID doesn't exists!");
  }
  const replies = await Reply.find({ post: req.params.id }).populate(
    "user",
    "name"
  );
  res.send(replies);
});

router.put("/like/:id", fetchuser, async (req, res) => {
  const reply = await Reply.findById(req.params.id);
  if (!reply) return res.status(400).send("reply doesn't exists");
  if (reply.author == req.user.id)
    return res.status(400).send("You can't upvote your own reply");
  const upvoteArray = reply.upvotes;
  const index = upvoteArray.indexOf(req.user.id);
  if (index === -1) {
    upvoteArray.push(req.user.id);
  } else {
    upvoteArray.splice(index, 1);
  }
  reply.upvotes = upvoteArray;
  const result = await reply.save();
  const reply_new = await Reply.find({ _id: reply._id }).populate(
    "user",
    "name"
  );
  res.send(reply_new);
});

module.exports = router;