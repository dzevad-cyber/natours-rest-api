import catchAsync from './catchAsync.js';
import AppError from './appError.js';
import ApiFeatures from './apiFeatures.js';

export const createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { [`${Model.modelName}`.toLowerCase()]: doc },
    });
  });

export const deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    await Model.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

export const updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError(`${Model.modelName} not found.`, 404));

    res.status(200).json({
      status: 'success',
      data: { [`${Model.modelName}`.toLowerCase()]: doc },
    });
  });

export const getOne = (Model, populateOpt) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOpt) query = query.populate(populateOpt);
    const doc = await query;

    if (!doc) return next(new AppError(`${Model.modelName} not found.`, 404));

    res.status(200).json({
      status: 'success',
      data: { [`${Model.modelName}`.toLowerCase()]: doc },
    });
  });

export const getAll = Model =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new ApiFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    if (!docs) return next(new AppError('Bad request.', 400));

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { [`${Model.modelName}s`.toLowerCase()]: docs },
    });
  });
