'use strict';

const authController = require('../controllers/authController');
const { catchError } = require('../libs/errorHandler');

module.exports = app => {
  app.route('/api/register').post(catchError(authController.register));

  app.route('/api/authenticate').post(authController.login);
};
