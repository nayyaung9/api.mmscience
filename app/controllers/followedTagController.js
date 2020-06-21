var FollowableTag = require("../models/FollowableTag");
const Tag = require("../models/Tag");
var mongoose = require("mongoose");

exports.followTags = async (req, res) => {
  const { tagId, id } = req.body;
  try {
    const followedTag = await FollowableTag({
      _user: id,
      _tags: tagId
    });
    const attachFollowerToTag = await Tag.findOneAndUpdate(
      { _id: tagId },
      {
        $push: {
          _user: id
        }
      }
    );
    await attachFollowerToTag.save();
    await followedTag.save();
    return res.status(200).json({ msg: "followed" });
  } catch (err) {
    console.log(err);
  }
};

exports.unFollowTag = async (req, res) => {
  const { tagId, id } = req.body;
  console.log(tagId, id);
  try {
    const unfollowtag = await FollowableTag.findOne({
      _user: id,
      _tags: tagId
    });
    const deleteFollowabletag = await FollowableTag.findOneAndRemove({
      _id: unfollowtag._id
    });

    const deleteTagAccatch = await Tag.update(
      { _id: tagId },
      { $pull: { _user: id } },
      { multi: true }
    );

    return res.status(200).send("Delete");
  } catch (err) {
    console.log(err);
  }
};

exports.fetchTagFollowedUsers = async (req, res) => {
  const { tagId } = req.params;
  try {
    const followers = await FollowableTag.find({})
      .populate({
        path: "_tags",
        match: { name: { $regex: tagId } }
      })
      .populate("_tags", "-_user")
      .populate("_user", "-following -followers -__v");

    // const followers = await FollowableTag.find({
    //   _tags: tagId
    // }).populate("_tags").populate("_user", "-following -password -followers -createdAt -updatedAt -__v ");

    if (!followers) return res.status(500).send("Error");
    return res.status(200).json({ succes: true, data: followers });
  } catch (err) {
    console.log(err);
  }
};
