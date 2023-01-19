
exports.notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
}

exports.errorHandler = (error, req, res, next) => {
    res.status(500).json({ message: error.message });
}