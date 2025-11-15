import mongoose from 'mongoose';

class DatabaseConfig {
  constructor() {
    this.connectionString = process.env.MONGODB_URI;
    this.databaseName = process.env.DB_NAME || 'necx_messaging_app';
    this.isConnected = false;
    this.connection = null;
  }

  async connect() {
    try {
      if (!this.connectionString) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }

      const options = {
        dbName: this.databaseName,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        retryWrites: true,
        w: 'majority'
      };

      this.connection = await mongoose.connect(this.connectionString, options);
      this.isConnected = true;

      // Handle connection events
      this.setupConnectionEvents();

      console.log('✅ Connected to MongoDB successfully');
      console.log(`📍 Database: ${this.databaseName}`);
      console.log(`📍 Host: ${this.connection.connection.host}`);
      console.log(`📍 Port: ${this.connection.connection.port}`);

    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);
      this.isConnected = false;
      throw error;
    }
  }

  setupConnectionEvents() {
    mongoose.connection.on('connected', () => {
      console.log('🔗 MongoDB connected');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🔌 MongoDB disconnected');
      this.isConnected = false;
    });

    // Handle application termination
    process.on('SIGINT', async () => {
      await this.disconnect();
      process.exit(0);
    });
  }

  async disconnect() {
    try {
      if (this.connection) {
        await mongoose.connection.close();
        this.isConnected = false;
        console.log('🛑 MongoDB connection closed');
      }
    } catch (error) {
      console.error('❌ Error closing MongoDB connection:', error);
    }
  }

  getConnectionStatus() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  getConnectionHealth() {
    return {
      isConnected: this.getConnectionStatus(),
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    };
  }
}

export default new DatabaseConfig();