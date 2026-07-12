import type { NextFunction, Request, Response, ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
};

export default errorHandler;
