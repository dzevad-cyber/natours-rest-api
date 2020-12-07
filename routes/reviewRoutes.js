import express from 'express';

import * as reviewController from '../controllers/reviewController.js';
import * as authMiddleware from '../middlewares/authMiddleware.js';
import * as reviewMiddleware from '../middlewares/reviewMiddleware.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    reviewMiddleware.setTourUserIds,
    reviewController.createReview
  )
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    reviewController.getAllReviews
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

export default router;
