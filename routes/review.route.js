const router = require('express').Router({mergeParams: true});


const {
  createReviewValidator,
  updateReviewValidator,
  getReviewValidator,
  deleteReviewValidator,
  // deleteReviewValidator,
} = require('../utils/validation/reviewValidator');

const {
  getReview,
  getReviews,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/review.controller');

const authControllers = require('../controllers/auth.controller');

router
  .route('/')
  .get(getReviews)
  .post(
    authControllers.protect,
    authControllers.allowedTo('user'),
    createReviewValidator,
    createReview
  );

router
  .route('/:id')
  .get(getReviewValidator,getReview)
  .put(
    authControllers.protect,
    authControllers.allowedTo('user'),
    updateReviewValidator,
    updateReview
  )

  .delete(
    authControllers.protect,
    authControllers.allowedTo('user', 'manager', 'admin'),
    deleteReviewValidator,
    deleteReview
  );

  module.exports = router;