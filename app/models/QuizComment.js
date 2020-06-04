var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuizCommentSchema = new Schema({
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
  article_id: {
    type: Schema.Types.ObjectId,
    ref: "Quiz"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('QuizComment', QuizCommentSchema);
