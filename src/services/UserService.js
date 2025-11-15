import { UserRepository } from '../repositories/UserRepository.js';
import { ValidationError, NotFoundError, ConflictError } from '../exceptions/CustomErrors.js';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers() {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async createUser(userData) {
    try {
      if (!userData.name || userData.name.trim().length === 0) {
        throw new ValidationError('User name is required');
      }

      if (userData.name.length > 50) {
        throw new ValidationError('User name must be less than 50 characters');
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findByName(userData.name.trim());
      if (existingUser) {
        throw new ConflictError('User with this name already exists');
      }

      return await this.userRepository.create({
        name: userData.name.trim()
      });
    } catch (error) {
      if (error instanceof ValidationError || error instanceof ConflictError) {
        throw error;
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      if (!userId) {
        throw new ValidationError('User ID is required');
      }

      // Get user to check if it exists and if it's a default user
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Don't allow deletion of default users
      if (user.name === 'me' || user.name === 'you') {
        throw new ValidationError('Cannot delete default users');
      }

      return await this.userRepository.delete(userId);
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  async findUserByName(name) {
    try {
      if (!name || name.trim().length === 0) {
        throw new ValidationError('User name is required');
      }
      
      return await this.userRepository.findByName(name.trim());
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      if (!userId) {
        throw new ValidationError('User ID is required');
      }
      
      return await this.userRepository.findById(userId);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }
}