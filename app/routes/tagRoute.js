'use strict';

const tagController = require('../controllers/tagController');
const verifyToken = require('../libs/verifyToken');
const { catchError } = require('../libs/errorHandler');

module.exports = app => {
  app
    .route('/api/tags')
    .get(verifyToken, catchError(tagController.fetchAllTags))
    .post(verifyToken, catchError(tagController.createTag));

  app.route('/api/tags/:name')
    .get(verifyToken, catchError(tagController.detailTagPosts));
  app.route('/api/tags/:id/delete')
    .delete(verifyToken, catchError(tagController.deleteTag));
};
