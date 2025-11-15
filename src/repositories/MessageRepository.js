import { Message } from '../models/index.js';

export class MessageRepository {
  async findAll() {
    try {
      return await Message.find().sort({ timestamp: 1 });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async create(messageData) {
    try {
      const message = new Message(messageData);
      return await message.save();
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async delete(messageId) {
    try {
      return await Message.findByIdAndDelete(messageId);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findById(messageId) {
    try {
      return await Message.findById(messageId);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async count() {
    try {
      return await Message.countDocuments();
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findMessagesBetweenUsers(user1, user2) {
    try {
      // Use case-insensitive regex for both sender and recipient matching
      return await Message.find({
        $or: [
          {
            sender: new RegExp(`^${user1}$`, 'i'),
            recipient: new RegExp(`^${user2}$`, 'i')
          },
          {
            sender: new RegExp(`^${user2}$`, 'i'),
            recipient: new RegExp(`^${user1}$`, 'i')
          }
        ]
      }).sort({ timestamp: 1 });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async update(messageId, updateData) {
    try {
      return await Message.findByIdAndUpdate(
        messageId,
        updateData,
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async searchMessages(query, filters = {}) {
    try {
      let searchQuery = {
        $text: { $search: query }
      };

      // Add additional filters if provided
      if (filters.sender) {
        searchQuery.sender = new RegExp(`^${filters.sender}$`, 'i');
      }
      if (filters.recipient) {
        searchQuery.recipient = new RegExp(`^${filters.recipient}$`, 'i');
      }
      if (filters.dateFrom) {
        searchQuery.timestamp = { $gte: new Date(filters.dateFrom) };
      }
      if (filters.dateTo) {
        searchQuery.timestamp = {
          ...searchQuery.timestamp,
          $lte: new Date(filters.dateTo)
        };
      }

      return await Message.find(searchQuery)
        .sort({ score: { $meta: 'textScore' }, timestamp: -1 })
        .limit(50);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}