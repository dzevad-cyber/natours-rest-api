import { clearHash } from '../utils/cache.js';
import catchAsync from '../utils/catchAsync.js';

export default catchAsync(async (req, res, next) => {
  await next();

  clearHash(req.body.user);
});
