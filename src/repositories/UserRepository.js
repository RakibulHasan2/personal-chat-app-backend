import { User } from '../models/index.js';

export class UserRepository {
  async findAll() {
    try {
      return await User.find().sort({ createdAt: 1 });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('User with this name already exists');
      }
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async delete(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findByName(name) {
    try {
      return await User.findOne({ name: new RegExp(`^${name}$`, 'i') });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async count() {
    try {
      return await User.countDocuments();
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}