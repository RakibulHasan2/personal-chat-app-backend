import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NECX Messaging Backend is running successfully!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Documentation route
router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the NECX Messaging API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      messages: {
        description: 'Message management endpoints',
        getAll: 'GET /api/messages',
        create: 'POST /api/messages',
        delete: 'DELETE /api/messages/:id'
      },
      users: {
        description: 'User management endpoints',
        getAll: 'GET /api/users',
        create: 'POST /api/users',
        delete: 'DELETE /api/users/:id'
      }
    }
  });
});

export default router;