'use strict';

const postController = require('../controllers/postController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');

module.exports = app => {
  app
    .route('/api/posts')
    .get(verifyToken, catchError(postController.fetchAllPosts))
    .post(verifyToken, catchError(postController.createPost));

  app
    .route('/api/post/:unique')
    .get(postController.getPostDetail);

  app
    .route('/api/feature_image/upload')
    .post(verifyToken, catchError(postController.featuredImageUpload));
}
