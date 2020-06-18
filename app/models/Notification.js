var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var NotificationSchema = new Schema(
  {
    sourceId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "onModel"
    },
    onModel: {
      type: String,
      required: true,
      enum: ["Post", "QUIZ", "DISCUSS"]
    },
    notiTargetRole: [
      {
        type: String,
        enum: ["ALL"]
      }
    ],
    specificSourceId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    sourceUser: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

NotificationSchema.pre("save", function(next) {
  if (this.notiTargetRole.length === 0) this.notiTargetRole.push("ALL");
  if (this.onModel.length === 0) this.onModel.push("Post");
  next();
});

module.exports = mongoose.model("Notification", NotificationSchema);
