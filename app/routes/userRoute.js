'use strict';

const userController = require('../controllers/userController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');

module.exports = app => {
  app
    .route('/users')
    .get(verifyToken, catchError(userController.listAllUsers))

}
