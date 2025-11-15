import { AppException } from '../exceptions/index.js';
import { appConfig } from '../config/app.js';

export const errorHandler = (err, req, res, next) => {
  // Log error details for debugging
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR:`, {
    message: err.message,
    stack: appConfig.server.environment === 'development' ? err.stack : undefined,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Handle custom application exceptions
  if (err instanceof AppException) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.name,
      message: err.message,
      errorCode: err.errorCode,
      details: err.details,
      timestamp: err.timestamp
    });
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid data provided',
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: 'Conflict',
      message: `Duplicate value for field: ${field}`,
      timestamp: new Date().toISOString()
    });
  }

  // Handle MongoDB cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID',
      message: 'Invalid ID format provided',
      timestamp: new Date().toISOString()
    });
  }

  // Handle JSON syntax errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: 'Invalid JSON',
      message: 'Request body contains invalid JSON',
      timestamp: new Date().toISOString()
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: appConfig.server.environment === 'production' 
      ? 'An unexpected error occurred' 
      : err.message,
    timestamp: new Date().toISOString(),
    ...(appConfig.server.environment === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route Not Found',
    message: `The route ${req.method} ${req.originalUrl} does not exist on this server`,
    timestamp: new Date().toISOString()
  });
};

/**
 * Request Logger Middleware
 * Logs all incoming requests with detailed information
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type')
  };

  console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - ${req.ip}`);
  
  // Log request body for POST/PUT requests (in development only)
  if (appConfig.server.environment === 'development' && 
      (req.method === 'POST' || req.method === 'PUT') && 
      req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }

  next();
};

/**
 * CORS Handler Middleware
 * Handles CORS preflight requests
 */
export const corsHandler = (req, res, next) => {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    return res.status(200).end();
  }
  
  next();
};

/**
 * Security Headers Middleware
 * Adds security headers to all responses
 */
export const securityHeaders = (req, res, next) => {
  // Basic security headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (basic)
  if (appConfig.server.environment === 'production') {
    res.header('Content-Security-Policy', "default-src 'self'");
  }
  
  next();
};

/**
 * Response Time Middleware
 * Adds response time header
 */
export const responseTime = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    res.header('X-Response-Time', `${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`[SLOW REQUEST] ${req.method} ${req.originalUrl} - ${duration}ms`);
    }
  });
  
  next();
};