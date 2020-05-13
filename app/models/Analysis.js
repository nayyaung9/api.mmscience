var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Analysis = new Schema({
  secret: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('analysis', Analysis);

