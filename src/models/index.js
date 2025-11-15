import mongoose from 'mongoose';
import { MessageSchema, UserSchema } from '../interfaces/schemas.js';
import { validateMessage, validateUser } from '../validators/index.js';

// Convert interface schema to Mongoose schema
const createMongooseSchema = (schemaDefinition) => {
  const mongooseFields = {};

  for (const [field, config] of Object.entries(schemaDefinition)) {
    mongooseFields[field] = {
      type: config.type === 'string' ? String :
        config.type === 'date' ? Date :
          config.type === 'number' ? Number :
            config.type === 'boolean' ? Boolean : String,
      required: config.required || false,
      unique: config.unique || false,
      trim: config.trim || false,
      maxLength: config.maxLength,
      minLength: config.minLength,
      default: config.default === 'now' ? Date.now : config.default
    };
  }

  return mongooseFields;
};

// Create Mongoose schemas from interface definitions
const messageSchema = new mongoose.Schema(createMongooseSchema(MessageSchema), {
  timestamps: true
});

// Add text search index for search functionality
messageSchema.index({ content: 'text', sender: 'text', recipient: 'text' });

const userSchema = new mongoose.Schema(createMongooseSchema(UserSchema), {
  timestamps: true
});

// Export models
export const Message = mongoose.model('Message', messageSchema);
export const User = mongoose.model('User', userSchema);

// Export validation functions from validators module
export { validateMessage, validateUser };