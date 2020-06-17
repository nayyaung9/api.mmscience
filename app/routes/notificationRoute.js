var notificationController = require("../controllers/notiController");
const verifyToken = require("../libs/verifyToken");
const { catchError } = require("../libs/errorHandler");

module.exports = app => {
  app
    .route('/api/notifications')
    .get(verifyToken, catchError(notificationController.getAllNotifications))
}
