var FactComment = require("../models/FactComment");
var cloudinary = require("cloudinary").v2;
const CONFIG = require("../../config/db");

exports.createFactComment = async (req, res) => {
  const { content, user, article_id } = req.body;
  let image = req.app.locals.imgName;
  image == "IMG" ? "-" : image || "-";

  if (image === "IMG") {
    let factComment = new FactComment({
      content,
      user,
      unique: Math.random()
        .toString(36)
        .substring(7),
      article_id,
      photo: null,
    });
    await factComment.save();
    return res.status(200).json({ success: true, data: factComment });
  } else {
    try {
      let imgUploading = new Promise((resolve, reject) => {
        cloudinary.config({
          cloud_name: CONFIG.cloudinary.name,
          api_key: CONFIG.cloudinary.api_key,
          api_secret: CONFIG.cloudinary.api_secret
        });
        cloudinary.uploader
          .upload(`../${CONFIG.root}/public/comments_photo/${image}`, {
            folder: "comments_photo",
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
      let factComment = new FactComment({
        content,
        user,
        unique: Math.random()
          .toString(36)
          .substring(7),
        article_id,
        photo: imgUrl
      });
      await factComment.save();
      return res.status(200).json({ success: true, data: factComment });
    } catch (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        return res
          .status(500)
          .send("There is a problem while sending a quiz comment");
      }
      return res.status(500).send(err.message);
    }
  }
};

exports.fetchFactCommentsByUniqueId = async (req, res) => {
  const { id } = req.params;
  const factComments = await FactComment.find({ article_id: id })
    .select("-__v")
    .populate(
      "user",
      "-bio -followers -following -isVerified -email -password -createdAt -updateAt -__v"
    );

  if (factComments) {
    return res.status(200).json({ success: true, data: factComments });
  }
};

exports.updateFactComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const factComment = await FactComment.findOneAndUpdate(
    { unique: commentId },
    {
      $set: {
        content
      }
    },
    { new: true }
  );
  if (!factComment) return res.status(404).send("Cannot update comment now");
  return res.status(200).json({ success: true, data: factComment });
};

exports.editFactComment = async (req, res) => {
  const { commentId } = req.params;
  const factComment = await FactComment.findOne({ unique: commentId });
  if (!factComment) return res.status(404).send("Comment not found");
  return res.status(200).json({ success: true, data: factComment });
};
