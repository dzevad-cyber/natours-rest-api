import * as factory from '../utils/handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
// import AppError from '../utils/appError.js';

import Tour from '../models/tourModel.js';

export const createTour = factory.createOne(Tour);
export const updateTour = factory.updateOne(Tour);
export const deleteTour = factory.deleteOne(Tour);
export const getTour = factory.getOne(Tour, { path: 'reviews' });

export const getAllTours = factory.getAll(Tour);

export const getTourStats = catchAsync(async (req, res, next) => {
  const status = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: '$difficulty',
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
        numOfTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { status },
  });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    { $project: { _id: 0 } },
    { $sort: { numTourStarts: 1 } },
    { $limit: 6 },
  ]);

  res.status(200).json({
    status: 'success',
    result: plan.length,
    data: { plan },
  });
});
