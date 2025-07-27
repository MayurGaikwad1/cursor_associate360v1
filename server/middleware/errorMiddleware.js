const mongoose = require('mongoose');

// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  // Default to 500 server error
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  let errors = null;

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    errors = Object.values(err.errors).map(val => ({
      field: val.path,
      message: val.message,
      value: val.value
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large';
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = 'Unexpected file field';
  }

  // Log error for debugging (exclude 4xx errors in production)
  if (process.env.NODE_ENV !== 'production' || statusCode >= 500) {
    console.error('🚨 Error:', {
      message: err.message,
      stack: err.stack,
      statusCode,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      user: req.user ? req.user._id : 'Anonymous',
      timestamp: new Date().toISOString()
    });
  }

  // Response object
  const errorResponse = {
    success: false,
    error: {
      message,
      statusCode,
      ...(errors && { details: errors }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  };

  res.status(statusCode).json(errorResponse);
};

// Async error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error helper
const validationError = (message, errors = null) => {
  return new AppError(message, 400, errors);
};

// Not authorized error helper
const notAuthorizedError = (message = 'Not authorized') => {
  return new AppError(message, 401);
};

// Forbidden error helper
const forbiddenError = (message = 'Forbidden') => {
  return new AppError(message, 403);
};

// Not found error helper
const notFoundError = (message = 'Resource not found') => {
  return new AppError(message, 404);
};

// Conflict error helper
const conflictError = (message = 'Resource already exists') => {
  return new AppError(message, 409);
};

// Internal server error helper
const internalServerError = (message = 'Internal server error') => {
  return new AppError(message, 500);
};

module.exports = {
  notFound,
  errorHandler,
  asyncHandler,
  AppError,
  validationError,
  notAuthorizedError,
  forbiddenError,
  notFoundError,
  conflictError,
  internalServerError
};