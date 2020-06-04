var Quiz = require("../models/Quiz");
var cloudinary = require("cloudinary").v2;
const CONFIG = require("../../config/db");

exports.fetchAllQuiz = async (req, res) => {
  const quiz = await Quiz.find()
    .select("-_id -__v")
    .populate("user", "-__v")
    .populate("tags", "-__v")
    .sort([["_id", -1]]);
  return res.status(200).json({ success: true, data: quiz });
};

exports.createQuiz = async (req, res) => {
  const { title, description, words, level, user_id } = req.body;
  let image = req.app.locals.imgName;
  const postTags = JSON.parse(words);

  const tags = postTags.map(item => {
    return item._id;
  });

  if (image === "IMG") {
    try {
      let quiz = new Quiz({
        title,
        description,
        unique: Math.random()
          .toString(36)
          .substring(7),
        user: user_id,
        tags,
        level,
        feature_image: null
      });
      await quiz.save();
      return res.status(200).json({ success: true, data: quiz });
    } catch (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(500).send("There is a problem while creating a quiz");
      }
      return res.status(500).send(err.message);
    }
  } else {
    try {

      let imgUploading = new Promise((resolve, reject) => {
        cloudinary.config({
          cloud_name: CONFIG.cloudinary.name,
          api_key: CONFIG.cloudinary.api_key,
          api_secret: CONFIG.cloudinary.api_secret
        });
        cloudinary.uploader
          .upload(`${CONFIG.root}/public/quiz/${req.app.locals.imgName}`, {
            folder: "quiz",
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
      let quiz = new Quiz({
        title,
        description,
        unique: Math.random()
          .toString(36)
          .substring(7),
        user: user_id,
        tags,
        level,
        feature_image: imgUrl
      });

      await quiz.save();
      return res.status(200).json({ success: true, data: quiz });
    } catch (err) {
      if (err.name === "MongoError" && err.code === 11000) {
        return res.status(500).send("There is a problem while creating a quiz");
      }
      return res.status(500).send(err.message);
    }
  }
};

exports.fetchQuizDetail = async (req, res) => {
  const quiz = await Quiz.findOne({ unique: req.params.unique })
    .select("-__v")
    .populate("user", "-__v -email -password -createdAt -updatedAt")
    .populate("tags", "-__v");
  if (!quiz) {
    return res
      .status(404)
      .json({ success: false, data: "Quiz is not availabled" });
  }
  return res.status(200).json({ success: true, data: quiz });
};
