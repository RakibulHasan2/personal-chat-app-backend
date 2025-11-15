import mongoose from 'mongoose';
import { Message, User } from '../models/index.js';

// MongoDB Connection Service
export const connectToDatabase = async () => {
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

// Database operations using MongoDB
export const DatabaseService = {
  // Messages operations
  async getAllMessages() {
    try {
      const messages = await Message.find().sort({ timestamp: 1 });
      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  },

  async saveMessage(messageData) {
    try {
      const message = new Message({
        content: messageData.content,
        sender: messageData.sender,
        timestamp: messageData.timestamp || new Date()
      });
      
      const savedMessage = await message.save();
      return savedMessage;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  },

  async deleteMessage(messageId) {
    try {
      const deletedMessage = await Message.findByIdAndDelete(messageId);
      return deletedMessage;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  // Users operations
  async getAllUsers() {
    try {
      const users = await User.find().sort({ createdAt: 1 });
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async saveUser(userData) {
    try {
      const user = new User({
        name: userData.name
      });
      
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this name already exists');
      }
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      return deletedUser;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async findUserByName(name) {
    try {
      const user = await User.findOne({ name: new RegExp(`^${name}$`, 'i') });
      return user;
    } catch (error) {
      console.error('Error finding user by name:', error);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  // Initialize data
  async initializeData() {
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
  }
};