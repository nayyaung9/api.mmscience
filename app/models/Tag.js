var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TagSchema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      trim: true,
      required: true
    },
    description: {
      type: String
    },
    parent: {
      type: String,
      default: 0,
    },
    tagCreator: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Tag", TagSchema);
