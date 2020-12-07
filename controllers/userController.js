import User from '../models/userModel.js';
import * as factory from '../utils/handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
// import AppError from '../utils/appError.js';
import { filterUpdateBody } from '../utils/utils.js';
import '../utils/cache.js';

export const createUser = factory.createOne(User);
// export const getUser = catchAsync(async (req, res, next) => {
//   const user = await User.findById(req.params.id).cache({ key: req.params.id });

//   if (!user) return next(new AppError('User not found.', 404));

//   res.status(200).json({
//     status: 'success',
//     data: { user },
//   });
// });
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);

export const updateMe = catchAsync(async (req, res, next) => {
  const updateBody = filterUpdateBody(req.body);

  const udpatedUser = await User.findByIdAndUpdate(req.user._id, updateBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: { user: udpatedUser },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
  });
});
