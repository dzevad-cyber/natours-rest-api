import jwt from 'jsonwebtoken';

const signToken = paylaod =>
  jwt.sign({ id: paylaod }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  };

  res.cookie('jwt', token, cookieOptions);

  user.__v = undefined;
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: { user },
  });
};

export const filterUpdateBody = updateBody => {
  const allowedUpdateFields = ['name', 'email'];

  const filteredBody = {};

  allowedUpdateFields.forEach(element => {
    if (updateBody[element]) filteredBody[element] = updateBody[element];
  });

  return filteredBody;
};
