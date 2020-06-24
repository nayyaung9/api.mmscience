var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FactCommentSchema = new Schema({
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
  photo: {
    type: String,
    default: null,
  },
  article_id: {
    type: Schema.Types.ObjectId,
    ref: "Post"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FactComment', FactCommentSchema);
