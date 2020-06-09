'use strict';

const authController = require('../controllers/authController');
const { catchError } = require('../libs/errorHandler');
const verifyToken = require('../libs/verifyToken');

module.exports = app => {
  app.route('/api/register').post(catchError(authController.register));

  app.route('/api/authenticate').post(authController.login);

  app.route('/api/user/:id/verify').get(verifyToken, authController.verify);

  app.route('/api/user/:user/account/confirmation').put(verifyToken, catchError(authController.VerifyAccount));
};
