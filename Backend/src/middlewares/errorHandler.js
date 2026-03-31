// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err); // optional logging

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;