"use strict";

const postController = require("../controllers/postController");
const factCommentController = require("../controllers/factCommentController");
const { catchError } = require("../libs/errorHandler");
const verifyToken = require("../libs/verifyToken");
const multer = require("multer");

var imgName = "IMG";
var date = new Date();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/featured_image");
  },
  filename: (req, file, cb) => {
    if (!file) {
      cb(null, false);
    } else {
      cb(null, file.originalname + "-" + date.getTime());
    }
  },
});

const commentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/comments_photo");
  },
  filename: (req, file, cb) => {
    console.log(file);
    if (!file) {
      cb(null, false);
    } else {
      cb(null, file.originalname + "-" + date.getTime());
    }
  },
});

const uploadStore = multer({
  storage,
});

const commentUploadStore = multer({
  storage: commentStorage,
});

module.exports = (app) => {
  app
    .route("/api/feed/:unique")
    .get(verifyToken, catchError(postController.getUserNewfeed));
  app
    .route("/api/posts")
    .get(catchError(postController.fetchAllPosts))
    .post(uploadStore.array("files"), catchError(postController.createPost))
    .put(
      verifyToken,
      uploadStore.any(),
      function (req, res, next) {
        req.app.locals.imgName = imgName;
        imgName = "IMG";
        next();
      },
      catchError(postController.updatePost)
    );

  app
    .route("/api/post/:unique")
    .get(postController.getPostDetail)
    .put(postController.viewerCount)
    .delete(postController.deletePost);

  app.route("/api/post/comment").post(
    verifyToken,
    commentUploadStore.any(),
    function (req, res, next) {
      req.app.locals.imgName = imgName;
      imgName = "IMG";
      next();
    },
    catchError(factCommentController.createFactComment)
  );

  app
    .route("/api/post/:id/comments")
    .get(catchError(factCommentController.fetchFactCommentsByUniqueId));

  app
    .route("/api/post/comment/:commentId/edit")
    .get(verifyToken, catchError(factCommentController.editFactComment))
    .put(verifyToken, catchError(factCommentController.updateFactComment));

  app
    .route("/api/featured_image/upload")
    .post(catchError(postController.featureImgUpload));
};
