import crypto from 'crypto';
import catchAsync from '../utils/catchAsync.js';
import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import Email from '../utils/email.js';
import { createAndSendToken } from '../utils/utils.js';

export const register = catchAsync(async (req, res, next) => {
  const user = await User.create({ ...req.body, role: 'user' });
  if (!user) return next(new AppError('User not created.', 400));

  createAndSendToken(user, 201, req, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please enter email and password.', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  createAndSendToken(user, 200, req, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('User not found.', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/reset-password/${resetToken}`;

  const message = `Hi ${user.name}.\nYou recently requested your password for you Natours account. Click the button below to reset it.\nIf You did not request a password reset, please ignore this email or reply to let us know.This password reset is only valid for next 15 minutes.\nThanks, Bob and Natours Team.\nP.S We also love hearing from you and helping you with issues you have.Please reply to this email if you want to ask a question or just say hi.\nIf you're having trouble clicking the password reset button, dopy and paste the URL below into your web browser.\n ${resetURL}`;

  try {
    await new Email(user, resetURL).send(
      message,
      'Token valid for 15 minutes.'
    );

    res.status(200).json({
      status: 'success',
      data: { message: 'Token sent to email.' },
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sendig the email. Try again later!', 500)
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedPassword = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedPassword,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Invalid token or expired.', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createAndSendToken(user, 200, req, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id).select('+password');

  console.log(user);
  if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
    return next(new AppError('Password does not match.', 400));
  }

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.newPasswordConfirm;
  await user.save();

  createAndSendToken(user, 200, req, res);
});
