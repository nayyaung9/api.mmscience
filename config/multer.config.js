const multer = require('multer');

var featureImageStorage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, 'public/featured_image')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var featureImageUpload = multer({ storage: featureImageStorage }).single('file');

var ProfilePictureStorage = multer.diskStorage({
  
  destination: function (req, file, cb) {
    cb(null, 'public/profile')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

var ProfilePictureUpload = multer({ storage: ProfilePictureStorage }).single('profile');

exports.featureImageUpload = featureImageUpload;
exports.ProfilePictureUpload = ProfilePictureUpload;
