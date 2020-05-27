'use strict';

const userController = require('../controllers/userController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');
const multer = require('multer');

var imgName = "IMG";
var date = new Date();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/profile');
  },
  filename: (req, file, cb) => {
    if (!file) {
      cb(null, false);
    }
    else {
      var imgDateName = date.getTime();
      var fileSplit = file.originalname.split('.');
      var fileExtension = fileSplit[fileSplit.length - 1];
      imgName = imgName + "-" + imgDateName + '-mmscience' + '.' + fileExtension;
      cb(null, imgName);
    }
  }
});

const uploadStore = multer({
  storage
});

module.exports = app => {
  app
    .route('/api/users')
    .get(verifyToken, catchError(userController.listAllUsers));
  app
    .route('/api/user/:id/posts')
    .get(verifyToken, catchError(userController.fetchUserPosts));
  app
    .route('/api/user/:id/tags')
    .get(catchError(userController.fetchUserTags));
  app
    .route('/api/user/:unique')
    .get(verifyToken, catchError(userController.fetchUserProfile));
  app
    .route('/api/user/:unique/update')
    .put(
      verifyToken,
      uploadStore.any(),
      function (req, res, next) {
        req.app.locals.imgName = imgName;
        imgName = "IMG";
        next()
      },
      catchError(userController.updateProfile));

}
