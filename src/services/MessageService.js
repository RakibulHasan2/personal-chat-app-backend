import { MessageRepository } from '../repositories/MessageRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { ValidationError, NotFoundError } from '../exceptions/CustomErrors.js';

export class MessageService {
  constructor() {
    this.messageRepository = new MessageRepository();
    this.userRepository = new UserRepository();
  }

  async getAllMessages() {
    try {
      return await this.messageRepository.findAll();
    } catch (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }
  }

  async getMessagesBetweenUsers(user1, user2) {
    try {
      // Verify both users exist
      const user1Exists = await this.userRepository.findByName(user1.trim());
      const user2Exists = await this.userRepository.findByName(user2.trim());

      if (!user1Exists) {
        throw new ValidationError(`User '${user1}' does not exist`);
      }

      if (!user2Exists) {
        throw new ValidationError(`User '${user2}' does not exist`);
      }
      return await this.messageRepository.findMessagesBetweenUsers(user1.trim(), user2.trim());
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Failed to fetch messages between users: ${error.message}`);
    }
  }

  async createMessage(messageData) {
    try {
      if (!messageData.content || messageData.content.trim().length === 0) {
        throw new ValidationError('Message content is required');
      }

      if (messageData.content.length > 1000) {
        throw new ValidationError('Message content must be less than 1000 characters');
      }

      if (!messageData.sender || messageData.sender.trim().length === 0) {
        throw new ValidationError('Sender is required');
      }

      if (!messageData.recipient || messageData.recipient.trim().length === 0) {
        throw new ValidationError('Recipient is required');
      }

      // Verify sender exists
      const senderExists = await this.userRepository.findByName(messageData.sender.trim());
      if (!senderExists) {
        throw new ValidationError('Sender must be a valid user');
      }

      // Verify recipient exists
      const recipientExists = await this.userRepository.findByName(messageData.recipient.trim());
      if (!recipientExists) {
        throw new ValidationError('Recipient must be a valid user');
      }

      return await this.messageRepository.create({
        content: messageData.content.trim(),
        sender: messageData.sender.trim(),
        recipient: messageData.recipient.trim(),
        timestamp: messageData.timestamp || new Date()
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }

  async deleteMessage(messageId) {
    try {
      if (!messageId) {
        throw new ValidationError('Message ID is required');
      }

      const deletedMessage = await this.messageRepository.delete(messageId);
      if (!deletedMessage) {
        throw new NotFoundError('Message not found');
      }

      return deletedMessage;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to delete message: ${error.message}`);
    }
  }

  async updateMessage(messageId, updateData) {
    try {
      if (!messageId) {
        throw new ValidationError('Message ID is required');
      }

      if (!updateData.content || updateData.content.trim().length === 0) {
        throw new ValidationError('Message content is required');
      }

      if (updateData.content.length > 1000) {
        throw new ValidationError('Message content must be less than 1000 characters');
      }

      // Check if message exists
      const existingMessage = await this.messageRepository.findById(messageId);
      if (!existingMessage) {
        throw new NotFoundError('Message not found');
      }

      // Prepare update data
      const messageUpdateData = {
        content: updateData.content.trim(),
        editedAt: new Date(),
        isEdited: true
      };

      const updatedMessage = await this.messageRepository.update(messageId, messageUpdateData);
      if (!updatedMessage) {
        throw new NotFoundError('Message not found');
      }

      return updatedMessage;
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError) {
        throw error;
      }
      throw new Error(`Failed to update message: ${error.message}`);
    }
  }

  async searchMessages(query, filters = {}) {
    try {
      if (!query || query.trim().length === 0) {
        throw new ValidationError('Search query is required');
      }

      if (query.trim().length < 2) {
        throw new ValidationError('Search query must be at least 2 characters long');
      }

      // Validate filters if provided
      if (filters.sender) {
        const senderExists = await this.userRepository.findByName(filters.sender.trim());
        if (!senderExists) {
          throw new ValidationError(`Sender '${filters.sender}' does not exist`);
        }
        filters.sender = filters.sender.trim();
      }

      if (filters.recipient) {
        const recipientExists = await this.userRepository.findByName(filters.recipient.trim());
        if (!recipientExists) {
          throw new ValidationError(`Recipient '${filters.recipient}' does not exist`);
        }
        filters.recipient = filters.recipient.trim();
      }

      return await this.messageRepository.searchMessages(query.trim(), filters);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new Error(`Failed to search messages: ${error.message}`);
    }
  }
}