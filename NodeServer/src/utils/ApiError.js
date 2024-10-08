class ApiError extends Error {
  constructor(
    statusCode,
    message = 'Something went wrong',
    errors = [],
    stack = ''
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.stack = stack;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.costructor);
    }
  }
}

export { ApiError };
