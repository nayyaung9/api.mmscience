"use strict";

const tagController = require("../controllers/tagController");
const verifyToken = require("../libs/verifyToken");
const { catchError } = require("../libs/errorHandler");

module.exports = app => {
  app
    .route("/api/tags")
    .get(verifyToken, catchError(tagController.fetchAllTags))
    .post(verifyToken, catchError(tagController.createTag));

  // this route is to fetch only tag detail
  app
    .route("/api/tag/:name")
    .get(verifyToken, catchError(tagController.getTagDetail));

  app
    .route("/api/tag/follow")
    .post(verifyToken, catchError(tagController.followTags));
  app
    .route("/api/tag/unfollow")
    .post(verifyToken, catchError(tagController.unFollowTag));

  // this route is to fetch posts that belongs to :name tag
  app
    .route("/api/tags/:name")
    .get(verifyToken, catchError(tagController.detailTagPosts));
  app
    .route("/api/tags/:id/delete")
    .delete(verifyToken, catchError(tagController.deleteTag));
};
