var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  sourceType: {
    type: String,
    required: true,
  },
  sourceId: {
    type: String,
    required: true,
  },
  notiTargetRole: [
    {
      type: String,
      enum: ['ALL'],
    },
  ],
  message: {
    type: String,
    required: true,
  },
  sourceUser: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});

NotificationSchema.pre('save', function(next) {
  if (this.notiTargetRole.length === 0) this.notiTargetRole.push('ALL');

  next();
});

module.exports = mongoose.model('Notification', NotificationSchema);
