import { MessageService } from '../services/MessageService.js';
import { ValidationError, NotFoundError } from '../exceptions/CustomErrors.js';

export class MessageController {
  constructor() {
    this.messageService = new MessageService();
  }

  async getAllMessages(req, res, next) {
    try {
      const messages = await this.messageService.getAllMessages();

      res.status(200).json({
        success: true,
        data: messages,
        count: messages.length
      });
    } catch (error) {
      next(error);
    }
  }

  async getMessagesBetweenUsers(req, res, next) {
    try {
      const { user1, user2 } = req.query;

      if (!user1 || !user2) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Both user1 and user2 parameters are required'
        });
      }

      const messages = await this.messageService.getMessagesBetweenUsers(user1, user2);

      res.status(200).json({
        success: true,
        data: messages,
        count: messages.length
      });
    } catch (error) {
      next(error);
    }
  }

  async createMessage(req, res, next) {
    try {
      const { content, sender, recipient } = req.body;
      const messageData = { content, sender, recipient };

      const newMessage = await this.messageService.createMessage(messageData);

      res.status(201).json({
        success: true,
        message: 'Message created successfully',
        data: newMessage
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
      }

      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { id } = req.params;

      const deletedMessage = await this.messageService.deleteMessage(id);

      res.status(200).json({
        success: true,
        message: 'Message deleted successfully',
        data: deletedMessage
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

  async updateMessage(req, res, next) {
    try {
      const { id } = req.params;
      const { content } = req.body;

      const updatedMessage = await this.messageService.updateMessage(id, { content });

      res.status(200).json({
        success: true,
        message: 'Message updated successfully',
        data: updatedMessage
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

  async searchMessages(req, res, next) {
    try {
      const { q, sender, recipient, dateFrom, dateTo } = req.query;

      const filters = {};
      if (sender) filters.sender = sender;
      if (recipient) filters.recipient = recipient;
      if (dateFrom) filters.dateFrom = dateFrom;
      if (dateTo) filters.dateTo = dateTo;

      const messages = await this.messageService.searchMessages(q, filters);

      res.status(200).json({
        success: true,
        data: messages,
        count: messages.length,
        query: q,
        filters: filters
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: error.message
        });
      }

      next(error);
    }
  }
}