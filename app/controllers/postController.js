const Post = require('../models/Post');
const imageUpload = require('../../config/multer.config');
const multer = require('multer');

exports.fetchAllPosts = async (req, res) => {
  const posts = await Post.find().select('-_id -__v').populate('user', '-__v').populate('tags', '-__v').sort([['_id', -1]]);
  return res.status(200).json({ success: true, data: posts });
}

exports.createPost = async (req, res) => {
  const { title, content, words, file, user_id } = req.body;
  const tags = words.map((item) => {
    return item._id;
  });
  try {
    let post = new Post({
      title,
      content,
      unique: Math.random().toString(36).substring(7),
      user: user_id,
      tags,
      feature_image: file,
    });
    return await post.save();
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send('There is a problem while creating a post');
    }
    return res.status(500).send(err.message);
  }
}

exports.getPostDetail = async (req, res) => {
  const post = await Post.findOne({ unique: req.params.unique }).select('-_id -__v').populate('user', '-__v');
  if(!post) {
    return res.status(404).json({ success: false, data: 'Post is not availabled' });
  }
  return res.status(200).json({ success: true, data: post });
}

exports.featuredImageUpload = async (req, res) => {
  imageUpload.featureImageUpload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    return res.status(200).send(req.file)
  });
}