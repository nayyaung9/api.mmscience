'use strict';

const postController = require('../controllers/postController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');

module.exports = app => {
  app
    .route('/api/posts')
    .get(verifyToken, catchError(postController.fetchAllPosts))

}
