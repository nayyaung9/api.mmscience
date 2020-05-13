'use strict';

const analysisController = require('../controllers/analysisController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');

module.exports = app => {
  app
    .route('/api/analysis/view/:key')
    .get(catchError(analysisController.getViewCount))
    .put(catchError(analysisController.viewCount));
};
