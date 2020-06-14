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
    _user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tag", TagSchema);
