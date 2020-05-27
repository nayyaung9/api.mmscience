var QuizController = require('../controllers/quizController');
const verifyToken = require('../libs/verifyToken');
const { catchError } = require('../libs/errorHandler');
const multer = require('multer');

var imgName = "IMG";
var date = new Date();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/quiz');
  },
  filename: (req, file, cb) => {
    if (!file) {
      cb(null, false);
    }
    else {
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
    .route('/api/quiz')
    .get(verifyToken, catchError(QuizController.fetchAllQuiz))
    .post(
      verifyToken, 
      uploadStore.any(),
      function (req, res, next) {
        req.app.locals.imgName = imgName;
        imgName = "IMG";
        next()
      },
      catchError(QuizController.createQuiz));
};