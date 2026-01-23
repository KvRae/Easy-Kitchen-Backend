// 404 Not Found Handler
exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

// Global Error Handler
// This middleware must be defined AFTER all other routes and middleware
exports.errorHandler = (error, req, res, next) => {
    try {
        // Get status code from error or default to 500
        const statusCode = error.statusCode || res.statusCode || 500;

        // Log error for debugging
        console.error('Error:', {
            status: statusCode,
            message: error.message,
            url: req.originalUrl,
            method: req.method,
            timestamp: new Date().toISOString()
        });

        // Set response status
        res.status(statusCode);

        // Prepare error response
        const errorResponse = {
            error: {
                message: error.message || 'An error occurred',
                status: statusCode
            }
        };

        // Add additional details in development
        if (process.env.NODE_ENV === 'development') {
            errorResponse.error.stack = error.stack;
        }

        // Send response
        return res.json(errorResponse);
    } catch (err) {
        // Fallback error handler if something goes wrong
        console.error('Error Handler Failure:', err);
        return res.status(500).json({
            error: {
                message: 'An unexpected error occurred',
                status: 500
            }
        });
    }
}
