'use strict';

const Tag = require('../models/Tag');
const Post = require('../models/Post');

exports.fetchAllTags = async (req, res) => {
  const tags = await Tag.find().populate('user_id', '-_id -email -password -createdAt -updatedAt -__v').select('-__v');
  return res.status(200).json({ succes: true, data: tags });
}

exports.createTag = async (req, res) => {
  const tag = Tag.findOne({ name: req.body.name });
  if(tag) {
    const newTag = new Tag(req.body);
    try {
      const result = await newTag.save();
      return res.status(200).json({ succes: true, data: result });
    } catch (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(403).send('Tag already exist!');
      }
      return res.status(500).send(err.message);
    }
  } else {
    console.log('not work');
    return res.status(403).send('Tag already exist');
  }

}

exports.getTagDetail = async (req, res) => {
  const { name } = req.params;
  const tag = await Tag.findOne({ name });
  if(!tag) return res.status(404).send('Tag not found');
  return res.status(200).json({ succes: true, data: tag });
}

exports.detailTagPosts = async (req, res) => {
  const { name } = req.params;
  await Post.find({}).populate({
    path  : 'tags',
    match : { name: { $regex: name } }
  }).populate('user', '-email -password -__v').exec((err, items) => {
    const data = items.filter(item => Object.keys(item.tags).length >= 1);
    return res.status(200).json({ success: true, data });
  });
}

exports.deleteTag = async (req, res) => {
  const { id } = req.params;
  return await Tag.findByIdAndRemove(id, (err) => {
    if(err) return res.send('Tag cannot be delete')
    res.send('Delete Successfully');
  })
}
