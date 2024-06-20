class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    const test = Error.captureStackTrace(this, this.constructor);

  }
}

module.exports = ErrorResponse;
