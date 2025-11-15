import { UserSchema, MessageSchema } from '../interfaces/schemas.js';

// Data validation functions based on interface schemas
const validateField = (fieldName, fieldConfig, data) => {
  const value = data[fieldName];
  const errors = [];

  // Required field validation
  if (fieldConfig.required && (!value || (typeof value === 'string' && !value.trim()))) {
    errors.push(`${fieldName} is required`);
    return errors;
  }

  // Skip other validations if field is not required and empty
  if (!value) return errors;

  // Type validation
  if (fieldConfig.type === 'string' && typeof value !== 'string') {
    errors.push(`${fieldName} must be a string`);
  }

  // Length validations for strings
  if (typeof value === 'string') {
    if (fieldConfig.maxLength && value.length > fieldConfig.maxLength) {
      errors.push(`${fieldName} must be less than ${fieldConfig.maxLength} characters`);
    }
    if (fieldConfig.minLength && value.trim().length < fieldConfig.minLength) {
      errors.push(`${fieldName} must be at least ${fieldConfig.minLength} character(s)`);
    }
  }

  return errors;
};

export const validateMessage = (data) => {
  const errors = [];

  for (const [fieldName, fieldConfig] of Object.entries(MessageSchema)) {
    // Skip auto-generated fields and edit-related fields
    if (fieldName === 'createdAt' || fieldName === 'timestamp' ||
      fieldName === 'editedAt' || fieldName === 'isEdited') continue;

    const fieldErrors = validateField(fieldName, fieldConfig, data);
    errors.push(...fieldErrors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateMessageUpdate = (data) => {
  const errors = [];

  // Only validate content for updates
  if (data.content !== undefined) {
    const contentConfig = MessageSchema.content;
    const fieldErrors = validateField('content', contentConfig, data);
    errors.push(...fieldErrors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUser = (data) => {
  const errors = [];

  for (const [fieldName, fieldConfig] of Object.entries(UserSchema)) {
    // Skip auto-generated fields
    if (fieldName === 'createdAt') continue;

    const fieldErrors = validateField(fieldName, fieldConfig, data);
    errors.push(...fieldErrors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};