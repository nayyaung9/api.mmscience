const Post = require("../models/Post");
const Notification = require("../models/Notification");
const Point = require("../models/Point");
var FollowableTag = require("../models/FollowableTag");
var NotiController = require("./notiController");
var mongoose = require("mongoose");
var cloudinary = require("cloudinary").v2;
const CONFIG = require("../../config/db");
const multer = require("multer");

var imgName = "IMG";
var date = new Date();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/featured_image");
  },
  filename: (req, file, cb) => {
    if (!file) {
      cb(null, false);
    } else {
      cb(null, file.originalname + "-" + date.getTime());
    }
  },
});

var upload = multer({ storage: storage }).single("file");

exports.getUserNewfeed = async (req, res) => {
  const { unique } = req.params;
  const getUserFollowedtags = await FollowableTag.find({
    _user: unique,
  }).populate("_tags");

  const posts = await Post.find({
    tags: {
      $in: getUserFollowedtags.map(function (o) {
        return mongoose.Types.ObjectId(o._tags._id);
      }),
    },
  })
    .populate(
      "user",
      "-following -isVerified -password -followers -createdAt -updatedAt  -__v"
    )
    .populate("tags", "-__v")
    .sort([["_id", -1]]);

  if (!posts)
    return res.status(404).json({ succes: false, data: "Please follow Tags" });

  return res.status(200).json({ succes: true, data: posts });
};

exports.fetchAllPosts = async (req, res) => {
  const posts = await Post.find()
    .select("-_id -__v")
    // .populate(
    //   "user",
    //   "-following -isVerified -_id -password -followers -createdAt -updatedAt  -__v"
    // )
    // .populate("tags", "-__v")
    .sort([["_id", -1]]);
  return res.status(200).json({ success: true, data: posts });
};

exports.createPost = async (req, res) => {
  // const { title, content, topics, imageList, captionText } = req.body;
  // console.log("req.body", req.body);
  // let filePaths = req.files;

  // let imgList = [];
  // let upload_len = filePaths.length;

  // let multipleUpload = new Promise((resolve, reject) => {
  //   cloudinary.config({
  //     cloud_name: CONFIG.cloudinary.name,
  //     api_key: CONFIG.cloudinary.api_key,
  //     api_secret: CONFIG.cloudinary.api_secret
  //   });

  //   upload_res = new Array();

  //   for (let i = 0; i < upload_len; i++) {
  //     let filePath = filePaths[i];

  //     cloudinary.uploader
  //       .upload(filePath.path, {
  //         folder: "featured_image",
  //         unique_filename: true
  //       })
  //       .then(result => {
  //         let imgUrl = result.secure_url;
  //         imgList.push(imgUrl);
  //         const caption = captionText.reverse();
  //         var armixed = imgList.map(function(imgName, i) {
  //           return [{ feature_image: imgName, text: caption[i] }];
  //         });

  //         return resolve(armixed.reverse());
  //       })
  //       .catch(error => error);
  //   }
  // });
  // for (let i = 0; i < upload_len; i++) {
  //   console.log("final", imgList);
  // }

  let newPost = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  await newPost.save();

  return res.status(200).json({ succes: true, data: newPost });
};

exports.getPostDetail = async (req, res) => {
  const post = await Post.findOne({ unique: req.params.unique })
    .select("-__v")
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
          feature_image: photo,
        },
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
        api_secret: CONFIG.cloudinary.api_secret,
      });
      cloudinary.uploader
        .upload(`../${CONFIG.root}/public/featured_image/${image}`, {
          folder: "featured_image",
          use_filename: true,
          unique_filename: false,
        })
        .then(function (image) {
          let imgUrl = image.secure_url;
          return resolve(imgUrl);
        })
        .catch(function (err) {
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
          feature_image: imgUrl,
        },
      },
      { new: true }
    );
    if (!post)
      res.status(500).send("THere was a problem while updating Profile");

    return res.status(200).json({ success: true, data: post });
  }
};

exports.featureImgUpload = async (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).json({ succes: true, data: req.file });
  });


  // return res.status(200).json({ succes: true, data: image });

  // cloudinary.config({
  //   cloud_name: CONFIG.cloudinary.name,
  //   api_key: CONFIG.cloudinary.api_key,
  //   api_secret: CONFIG.cloudinary.api_secret,
  // });
  // cloudinary.uploader
  //   .upload(`../${CONFIG.root}/public/featured_image/${image}`, {
  //     folder: "featured_image",
  //     use_filename: true,
  //     unique_filename: false,
  //   })
  //   .then(function (image) {
  //     console.log("add", image);
  //     return res.status(200).json({
  //       success: 1,
  //       file: {
  //         url: image.secure_url,
  //         // ... and any additional fields you want to store, such as width, height, color, extension, etc
  //       },
  //     });
  //   })
  //   .catch(function (err) {
  //     if (err) {
  //       console.warn(err);
  //     }
  //   });
};

exports.deletePost = async (req, res) => {
  const post = await Post.findOneAndRemove({ unique: req.params.unique });
  const deleteNotification = await Notification.findOneAndRemove({
    specificSourceId: req.params.unique,
  });
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
