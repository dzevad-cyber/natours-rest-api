import express from 'express';

import * as tourController from '../controllers/tourController.js';
import * as tourMiddleware from '../middlewares/toursMiddleware.js';
import * as authMiddleware from '../middlewares/authMiddleware.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-tours')
  .get(tourMiddleware.aliasTopTours, tourController.getAllTours);

router.route('/get-stats').get(tourController.getTourStats);

router.route('/').get(tourController.getAllTours);
router.route('/:id').get(tourController.getTour);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

router.use(
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'lead-guide')
);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route('/').post(tourController.createTour);

router
  .route('/:id')
  .delete(tourController.deleteTour)
  .patch(tourController.updateTour);

export default router;
