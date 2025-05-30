import logger from '../utils/logger.js';

const requestLogger = (req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
};

export default requestLogger; 