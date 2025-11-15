import { UserService } from '../services/UserService.js';
import { ValidationError, NotFoundError, ConflictError } from '../exceptions/CustomErrors.js';

export class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      
      res.status(200).json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    try {
      const { name } = req.body;
      const userData = { name };
      
      const newUser = await this.userService.createUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
      }
      
      if (error instanceof ConflictError) {
        return res.status(409).json({
          success: false,
          error: 'Conflict Error',
          message: error.message
        });
      }
      
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      
      const deletedUser = await this.userService.deleteUser(id);
      
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
      }
      
      if (error instanceof NotFoundError) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: error.message
        });
      }
      
      next(error);
    }
  }
}