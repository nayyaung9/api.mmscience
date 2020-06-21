var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PointSchema = new Schema({
  _user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  points: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Point', PointSchema);
