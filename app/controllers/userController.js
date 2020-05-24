const Post = require('../models/Post');
const Tag = require('../models/Tag');

exports.fetchUserPosts = async (req, res) => {
  const { id } = req.params;
  const posts = await Post.find({ user: id }).populate('user').populate('tags');
  if(!posts) return res.status(404).send('posts not found');
  return res.status(200).json({ succes: true, data: posts });
}

exports.fetchUserTags = async (req, res) => {
  const { id } = req.params;
  console.log('id', id);
  const tags = await Tag.find({ user: id }).populate('user');
  console.log(tags);
  if(!tags) return res.status(404).send('tags not found');
  return res.status(200).json({ succes: true, data: tags });
}
