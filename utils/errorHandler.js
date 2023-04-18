const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'UnauthorizedError') {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (err.name === 'NotFoundError') {
      return res.status(404).json({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'SequelizeValidationError') {
      const errorMessages = err.errors.map((e) => e.message);
      return res.status(400).json({ message: errorMessages });
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
      const errorMessages = err.errors.map((e) => e.message);
      return res.status(409).json({ message: errorMessages });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  };
  
  module.exports = errorHandler;
  