import Review from '../models/reviewModel.js';
import * as factory from '../utils/handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import '../utils/cache.js';
import { clearHash } from '../utils/cache.js';

export const createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  if (!review) {
    return next(new AppError('Bad request.', 400));
  }

  res.status(201).json({
    status: 'success',
    data: { review },
  });
});
export const getReview = factory.getOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
export const getAllReviews = factory.getAll(Review);

export const getReviewsByUser = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.params.id }).cache({
    key: req.params.id,
  });

  res.status(200).json({
    status: 'success',
    reviews: reviews.length,
    data: { reviews },
  });
});
