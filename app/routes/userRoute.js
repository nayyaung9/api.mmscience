'use strict';

const userController = require('../controllers/userController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');

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
}
