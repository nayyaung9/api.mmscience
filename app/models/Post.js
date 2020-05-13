var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  unique: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag"
    }
  ],
  feature_image: {
    type: String,
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', PostSchema);

