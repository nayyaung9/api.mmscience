var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var TokenSchema = new Schema(
  {
    _userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    token: { type: String, required: true },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      expires: 43200,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Token", TokenSchema);
