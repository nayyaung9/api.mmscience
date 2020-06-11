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
    following: {
      users: [
        {
          type: Schema.Types.ObjectId,
          ref: "User"
        }
      ]
    }
  },
  {
    timestamps: true
  }
);

TagSchema.methods.follow = function(userId) {
  if (this.following.users.indexOf(userId) === -1) {
    this.following.users.push(userId);
  }
  return this.save();
};

TagSchema.methods.unfollow = function(userId) {
  console.log('un', this.following.users.toString().indexOf(userId));
  if (this.following.users.toString().indexOf(userId) !== -1) {
        console.log(this.following.users);
    this.following.users.shift(userId);

  }
  return this.save();
};

module.exports = mongoose.model("Tag", TagSchema);
