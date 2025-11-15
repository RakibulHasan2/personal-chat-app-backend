import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { User } from './src/models/index.js';

// Route imports
import apiRoutes from './src/routes/index.js';
import messageRoutes from './src/routes/messages.js';
import userRoutes from './src/routes/users.js';

const app = express();
const PORT = process.env.PORT || 4000;

// MongoDB Connection
const connectToDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    await mongoose.connect(mongoUri, {
      dbName: process.env.DB_NAME || 'necx_messaging_app'
    });

    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
};

// Initialize default data
const initializeData = async () => {
  try {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      console.log('🔧 Initializing default users...');

      const defaultUsers = [
        { name: 'me' },
        { name: 'you' }
      ];

      await User.insertMany(defaultUsers);
      console.log('✅ Default users initialized in MongoDB');
    } else {
      console.log(`✅ Found ${userCount} existing users in database`);
    }
  } catch (error) {
    console.error('Error initializing data:', error);
    throw error;
  }
};

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://personal-chat-application-frontend.vercel.app']
    : [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// Initialize and start server
const startServer = async () => {
  try {
    console.log('🔧 Initializing NECX Messaging Backend...');

    // Connect to MongoDB
    await connectToDatabase();

    // Initialize database with default data
    await initializeData();
    console.log('✅ Database initialization complete');

    // Start server
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 NECX Messaging Backend Server Started!');
      console.log('━'.repeat(50));
      console.log(`📍 Server URL: http://localhost:${PORT}`);
      console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`📍 API Documentation: http://localhost:${PORT}/api`);
      console.log(`📍 Messages API: http://localhost:${PORT}/api/messages`);
      console.log(`📍 Users API: http://localhost:${PORT}/api/users`);
      console.log('━'.repeat(50));
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
      console.log('✅ Backend Ready for Connections!');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down server gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\\n🛑 Server terminated');
  process.exit(0);
});

// Start the server
startServer();

export default app;