import express from 'express';
import clearCache from '../middlewares/clearCache.js';

const router = express.Router();

import * as reviewController from '../controllers/reviewController.js';

router
  .route('/')
  .post(clearCache, reviewController.createReview)
  .get(reviewController.getAllReviews);

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

router.route('/users/:id').get(reviewController.getReviewsByUser);

export default router;
