import User from '../models/userModel.js';
import * as factory from '../utils/handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import '../utils/cache.js';

export const createUser = factory.createOne(User);
export const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).cache({ key: req.params.id });

  if (!user) return next(new AppError('User not found.', 404));

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
export const getAllUsers = factory.getAll(User);
