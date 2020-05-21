const Post = require("../models/Post");
const multer = require("multer");
var cloudinary = require("cloudinary").v2;
const CONFIG = require('../../config/db');

exports.fetchAllPosts = async (req, res) => {
  const posts = await Post.find()
    .select("-_id -__v")
    .populate("user", "-__v")
    .populate("tags", "-__v")
    .sort([["_id", -1]]);
  return res.status(200).json({ success: true, data: posts });
};

exports.createPost = async (req, res) => {
  console.log(req.body);
  const { title, content, words, user_id } = req.body;
  let image = req.app.locals.imgName;
  const postTags = JSON.parse(words);

  const tags = postTags.map(item => {
    return item._id;
  });

  try {
    let post = new Post({
      title,
      content,
      unique: Math.random()
        .toString(36)
        .substring(7),
      user: user_id,
      tags,
      feature_image: image,
    });

    cloudinary.config({
      cloud_name: CONFIG.cloudinary.name,
      api_key: CONFIG.cloudinary.api_key,
      api_secret: CONFIG.cloudinary.api_secret,
    });

    cloudinary.uploader
      .upload(`${CONFIG.root}/public/featured_image/${req.app.locals.imgName}`, {
        folder: "featured_image",
        use_filename: true,
        unique_filename: false
      })
      .then(function (image) {
        console.log("* " + JSON.stringify(image));
        console.log("* " + image.url);
      })
      .catch(function (err) {
        if (err) {
          console.warn(err);
        }
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

exports.viewerCount = async (req, res) => {
  const views = await Post.findOneAndUpdate({ unique: req.params.unique }, { $inc: { views: 1 } }, {  new: true });
  return res.status(200).json({ success: true, data: views });
}