export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    path: req.path,
    method: req.method,
    body: req.body,
    error: err.stack
  });
  
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error'
  });
}; 