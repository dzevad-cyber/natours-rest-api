export default class Err extends Error {
  constructor(message, statusCode) {
    super();

    this.statusCode = statusCode;
    this.status = `statusCode`.startsWith(4) ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}