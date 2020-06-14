const Post = require("../models/Post");
const User = require("../models/User");
const Tag = require("../models/Tag");
var FollowableTag = require("../models/FollowableTag");
var mongoose = require("mongoose");
var cloudinary = require("cloudinary").v2;
const CONFIG = require("../../config/db");

exports.getUserNewfeed = async (req, res) => {
  const { unique } = req.params;
  const getUserFollowedtags = await FollowableTag.find({
    _user: unique
  }).populate("_tags");

  const posts = await Post.find({
    tags: {
      $in: getUserFollowedtags.map(function(o) {
        return mongoose.Types.ObjectId(o._tags._id);
      })
    }
  })
    .populate(
      "user",
      "-following -isVerified -password -followers -createdAt -updatedAt  -__v"
    )
    .populate("tags", "-__v")
    .sort([["_id", -1]]);

  if(!posts) return res.status(404).json({ succes: false, data: 'Please follow Tags'})

  return res.status(200).json({ succes: true, data: posts });
};

exports.fetchAllPosts = async (req, res) => {
  const posts = await Post.find()
    .select("-_id -__v")
    .populate(
      "user",
      "-following -isVerified -_id -password -followers -createdAt -updatedAt  -__v"
    )
    .populate("tags", "-__v")
    .sort([["_id", -1]]);
  return res.status(200).json({ success: true, data: posts });
};

exports.createPost = async (req, res) => {
  const { title, content, words, user_id } = req.body;
  let image = req.app.locals.imgName;
  const postTags = JSON.parse(words);

  const tags = postTags.map(item => {
    return item._id;
  });

  try {
    let imgUploading = new Promise((resolve, reject) => {
      cloudinary.config({
        cloud_name: CONFIG.cloudinary.name,
        api_key: CONFIG.cloudinary.api_key,
        api_secret: CONFIG.cloudinary.api_secret
      });
      cloudinary.uploader
        .upload(`../${CONFIG.root}/public/featured_image/${image}`, {
          folder: "featured_image",
          use_filename: true,
          unique_filename: false
        })
        .then(function(image) {
          let imgUrl = image.secure_url;
          return resolve(imgUrl);
        })
        .catch(function(err) {
          if (err) {
            console.warn(err);
          }
        });
    });

    let imgUrl = await imgUploading;

    let post = new Post({
      title,
      content,
      unique: Math.random()
        .toString(36)
        .substring(7),
      user: user_id,
      tags,
      feature_image: imgUrl
    });
    await post.save();
    return res.status(200).json({ success: true, data: post });
  } catch (err) {
    if (err.name === "MongoError" && err.code === 11000) {
      return res.status(500).send("There is a problem while creating a post");
    }
    return res.status(500).send(err.message);
  }
};

exports.getPostDetail = async (req, res) => {
  const post = await Post.findOne({ unique: req.params.unique })
    .select("-_id -__v")
    .populate("user", "-__v -email -password -createdAt -updatedAt")
    .populate("tags", "-__v");
  if (!post) {
    return res
      .status(404)
      .json({ success: false, data: "Post is not availabled" });
  }
  return res.status(200).json({ success: true, data: post });
};

exports.updatePost = async (req, res) => {
  const { title, content, tags, photo, user_id, unique } = req.body;
  const words = JSON.parse(tags);
  let image = req.app.locals.imgName;
  image == "IMG" ? "-" : image || "-";

  if (image === "IMG") {
    const post = await Post.findOneAndUpdate(
      { unique: req.body.unique },
      {
        $set: {
          title,
          content,
          unique,
          user: user_id,
          tags: words,
          feature_image: photo
        }
      },
      { new: true }
    );
    if (!post)
      res.status(500).send("THere was a problem while updating Profile");

    return res.status(200).json({ success: true, data: post });
  } else {
    let imgUploading = new Promise((resolve, reject) => {
      cloudinary.config({
        cloud_name: CONFIG.cloudinary.name,
        api_key: CONFIG.cloudinary.api_key,
        api_secret: CONFIG.cloudinary.api_secret
      });
      cloudinary.uploader
        .upload(`../${CONFIG.root}/public/featured_image/${image}`, {
          folder: "featured_image",
          use_filename: true,
          unique_filename: false
        })
        .then(function(image) {
          let imgUrl = image.secure_url;
          return resolve(imgUrl);
        })
        .catch(function(err) {
          if (err) {
            console.warn(err);
          }
        });
    });

    let imgUrl = await imgUploading;

    const post = await Post.findOneAndUpdate(
      { unique: req.body.unique },
      {
        $set: {
          title,
          content,
          unique,
          user: user_id,
          tags: words,
          feature_image: imgUrl
        }
      },
      { new: true }
    );
    if (!post)
      res.status(500).send("THere was a problem while updating Profile");

    return res.status(200).json({ success: true, data: post });
  }
};

exports.featureImgUpload = async (req, res) => {
  let image = req.app.locals.imgName;
  cloudinary.config({
    cloud_name: CONFIG.cloudinary.name,
    api_key: CONFIG.cloudinary.api_key,
    api_secret: CONFIG.cloudinary.api_secret
  });
  cloudinary.uploader
    .upload(`../${CONFIG.root}/public/featured_image/${image}`, {
      folder: "featured_image",
      use_filename: true,
      unique_filename: false
    })
    .then(function(image) {
      return res.status(200).send(image);
    })
    .catch(function(err) {
      if (err) {
        console.warn(err);
      }
    });
};

exports.deletePost = async (req, res) => {
  const post = await Post.findOneAndRemove({ unique: req.params.unique });
  if (!post) return res.send("Post cannot be delete");
  res.send("Delete Successfully");
};

exports.viewerCount = async (req, res) => {
  const views = await Post.findOneAndUpdate(
    { unique: req.params.unique },
    { $inc: { views: 1 } },
    { new: true }
  );
  return res.status(200).json({ success: true, data: views });
};
