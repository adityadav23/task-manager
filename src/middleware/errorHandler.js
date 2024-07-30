const createError = require('http-errors'); // Optional: Use http-errors for standard HTTP errors

// Centralized error handler
const errorHandler = (err, req, res, next) => {
    // Log the error details (you might use a logging library like Winston or Morgan in production)
    console.error(err.stack);

    // Define a default error response structure
    const errorResponse = {
        status: err.status || 500,
        message: err.message || 'Internal Server Error'
    };

    // If the error is a known HTTP error (e.g., from http-errors), set the status code
    if (createError.isHttpError(err)) {
        res.status(err.status || 500).json(errorResponse);
    } else {
        // For other errors, use a generic server error status
        res.status(500).json(errorResponse);
    }
};

module.exports = errorHandler;
