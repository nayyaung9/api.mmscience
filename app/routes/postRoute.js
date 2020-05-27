'use strict';

const postController = require('../controllers/postController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');
const multer = require('multer');

var imgName = "IMG";
var date = new Date();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/featured_image');
  },
  filename: (req, file, cb) => {
    if (!file) {
      cb(null, false);
    }
    else {
      console.log('file', file);
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
    .route('/api/posts')
    .get(verifyToken, catchError(postController.fetchAllPosts))
    .post(
      verifyToken,
      uploadStore.any(),
      function (req, res, next) {
        req.app.locals.imgName = imgName;
        imgName = "IMG";
        next()
      },
      catchError(postController.createPost))
    .put(
      verifyToken,
      uploadStore.any(),
      function (req, res, next) {
        req.app.locals.imgName = imgName;
        imgName = "IMG";
        next()
      },
      catchError(postController.updatePost));

  app
    .route('/api/post/:unique')
    .get(postController.getPostDetail)
    .put(postController.viewerCount)
    .delete(postController.deletePost);
}
