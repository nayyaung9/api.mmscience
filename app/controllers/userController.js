const Post = require("../models/Post");
const Tag = require("../models/Tag");
const User = require("../models/User");
var cloudinary = require("cloudinary").v2;
const CONFIG = require("../../config/db");

exports.fetchUserPosts = async (req, res) => {
  const { id } = req.params;
  const posts = await Post.find({ user: id })
    .populate("user")
    .populate("tags")
    .sort([["_id", -1]]);
  console.log(posts);
  if (!posts) return res.status(404).send("posts not found");
  return res.status(200).json({ succes: true, data: posts });
};

exports.fetchUserTags = async (req, res) => {
  const { id } = req.params;
  const tags = await Tag.find({ tagCreator: id }).populate("user");
  if (!tags) return res.status(404).send("tags not found");
  return res.status(200).json({ succes: true, data: tags });
};

exports.fetchUserProfile = async (req, res) => {
  const { unique } = req.params;
  console.log(unique);
  const user = await User.findOne({ uniqueId: unique });
  if (!user) return res.status(4040).send("User Not Found");
  return res.status(200).json({ succes: true, data: user });
};

exports.updateProfile = async (req, res) => {
  const { unique } = req.params;
  const { fullname, bio, photo } = req.body;
  let image = req.app.locals.imgName;
  image == "IMG" ? "-" : image || "-";

  if (image === "IMG") {
    const user = await User.findOneAndUpdate(
      { uniqueId: unique },
      {
        $set: {
          fullname: fullname,
          avatar_url: photo,
          bio: bio
        }
      },
      { new: true }
    );

    if (!user)
      res.status(500).send("THere was a problem while updating Profile");
    res.status(200).json({ success: true, data: user });
  } else {
    let imgUploading = new Promise((resolve, reject) => {
      cloudinary.config({
        cloud_name: CONFIG.cloudinary.name,
        api_key: CONFIG.cloudinary.api_key,
        api_secret: CONFIG.cloudinary.api_secret
      });
      cloudinary.uploader
        .upload(`../${CONFIG.root}/public/profile/${image}`, {
          folder: "profile",
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
    const user = await User.findOneAndUpdate(
      { uniqueId: unique },
      {
        $set: {
          fullname: req.body.fullname,
          avatar_url: imgUrl,
          bio: req.body.bio
        }
      },
      { new: true }
    );

    if (!user)
      res.status(500).send("THere was a problem while updating Profile");
    res.status(200).json({ success: true, data: user });
  }
};
