import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) return next(new AppError('Please log in.', 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('Token belonging to this user does not longer exists.', 401)
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Please log in.', 401));
  }

  req.user = freshUser;
  next();
});

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Permission denied!', 403));
  }
  next();
};
