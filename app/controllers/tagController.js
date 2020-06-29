"use strict";

const Tag = require("../models/Tag");
const Post = require("../models/Post");
const User = require("../models/User");
const Notification = require("../models/Notification");
var NotiController = require("./notiController");

exports.fetchAllTags = async (req, res) => {
  const tags = await Tag.find()
    .populate(
      "_user",
      "-email -password -following -isVerified -followers -createdAt -updatedAt -__v"
    )
    .select("-__v");
  return res.status(200).json({ succes: true, data: tags });
};

exports.createTag = async (req, res) => {
  const tag = Tag.findOne({ name: req.body.name });
  if (tag) {
    const newTag = new Tag(req.body);
    try {
      const result = await newTag.save();
      let data = {
        onModel: "Tag",
        sourceId: result._id,
        notiTargetRole: "ALL",
        specificSourceId: req.body.name,
        message: "create a new topic",
        sourceUser: result.tagCreator
      };
      await NotiController.createNewNotification(req.io, data);
      return res.status(200).json({ succes: true, data: result });
    } catch (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(403).send("Tag already exist!");
      }
      return res.status(500).send(err.message);
    }
  } else {
    return res.status(403).send("Tag already exist");
  }
};

exports.getTagDetail = async (req, res) => {
  const { name } = req.params;
  const tag = await Tag.findOne({ name })
    .populate(
      "tagCreator",
      "-email -password -following -isVerified -followers -createdAt -updatedAt -__v"
    )
    .populate("_user", "-email -password -createdAt -updatedAt")
    .select("-__v");
  if (!tag) return res.status(404).send("Tag not found");
  return res.status(200).json({ succes: true, data: tag });
};

exports.detailTagPosts = async (req, res) => {
  const { name } = req.params;
  await Post.find({})
    .populate({
      path: "tags",
      match: { name: { $regex: name } }
    })
    .populate(
      "user",
      "-email -password -following -isVerified -followers -createdAt -updatedAt -__v"
    )
    .exec((err, items) => {
      const data = items.filter(item => Object.keys(item.tags).length >= 1);
      return res.status(200).json({ success: true, data });
    });
};

exports.updateTagDetail = async (req, res) => {
  const { tagId } = req.params;
  const { name, description } = req.body;
  console.log(name, description, tagId);
  const tag = await Tag.findOneAndUpdate(
    { _id: tagId },
    {
      $set: {
        name,
        description
      }
    },
    { new: true }
  );
  if (!tag) {
    return res.status(500).send("tag not found");
  }

  return res.status(200).json(tag);
};

exports.deleteTag = async (req, res) => {
  const { id } = req.params;
  console.log('tagId', id);
  return await Tag.findByIdAndRemove(id, async err => {
    if (err) return res.send("Tag cannot be delete");
    await Notification.findOneAndRemove({
      sourceId: id
    });
    res.send("Delete Successfully");
  });
};
