var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var FollowableTag = new Schema(
  {
    _user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    _tags: {
      type: Schema.Types.ObjectId,
      ref: "Tag"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FollowableTag", FollowableTag);
