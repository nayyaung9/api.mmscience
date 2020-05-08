const Post = require('../models/Post');

exports.fetchAllPosts = async (req, res) => {
  const posts = await Post.find().select('-_id -__v').populate('user', '-__v').sort([['_id', -1]]);
  return res.status(200).json({ success: true, data: posts });
}
