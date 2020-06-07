var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true
    },
    description: {
      type: String
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true
  }
);

TagSchema.methods.follow = function(userId) {
  if (this.following.indexOf(userId) === -1) {
    this.following.push(userId);
  }
  return this.save();
};

module.exports = mongoose.model("Tag", TagSchema);
