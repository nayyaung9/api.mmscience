const Analysis = require('../models/Analysis');

exports.viewCount = async (req, res) => {
  const views = await Analysis.findOneAndUpdate({ secret: req.params.key }, { $inc: { views: 1 } }, {  new: true });
  return res.status(200).json({ success: true, data: views });
}

exports.getViewCount = async (req, res) => {
  const views = await Analysis.findOne({ secret: 'mmscience' });
  return res.status(200).json({ success: true, data: views });
}