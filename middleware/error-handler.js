
exports.notFound = (req, res, next) => {
    res.status(404).json({ message: 'Page not found' });
}

exports.errorHandler = (error, req, res, next) => {
    res.status(500).json({ message: error.message });
}