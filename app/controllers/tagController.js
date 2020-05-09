'use strict';

const Tag = require('../models/Tag');
const Post = require('../models/Post');

exports.fetchAllTags = async (req, res) => {
  const tags = await Tag.find().populate('user_id', '-_id -email -password -createdAt -updatedAt -__v').select('-__v');
  return res.status(200).json({ succes: true, data: tags });
}

exports.createTag = async (req, res) => {
  const tag = new Tag(req.body);
  try {
    const result = await tag.save();
    return res.status(200).json({ succes: true, data: result });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      return res.status(500).send('Tag already exist!');
    }
    return res.status(500).send(err.message);
  }
}

exports.detailTagPosts = async (req, res) => {
  const { name } = req.params;
  const tagPosts = await Post.find({}).populate({
    path  : 'tags',
    match : { name: { $regex: name } }
  }).populate('user', '-_id -email -password -__v').populate('tags').exec((err, items) => {
    const data = items.filter(item => Object.keys(item.tags).length >= 1);
    return res.status(200).json({ success: true, data });
  });
}

exports.deleteTag = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  return await Tag.findByIdAndRemove(id, (err) => {
    if(err) return res.send('Tag cannot be delete')
    res.send('Delete Successfully');
  })
}
