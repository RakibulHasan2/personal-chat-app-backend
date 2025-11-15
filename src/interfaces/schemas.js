// User Schema Definition
export const UserSchema = {
  name: {
    type: 'string',
    required: true,
    unique: true,
    trim: true,
    maxLength: 50,
    minLength: 1
  },
  createdAt: {
    type: 'date',
    default: 'now'
  }
};

// Message Schema Definition
export const MessageSchema = {
  content: {
    type: 'string',
    required: true,
    trim: true,
    maxLength: 1000,
    minLength: 1
  },
  sender: {
    type: 'string',
    required: true,
    trim: true,
    maxLength: 50
  },
  recipient: {
    type: 'string',
    required: true,
    trim: true,
    maxLength: 50
  },
  timestamp: {
    type: 'date',
    default: 'now'
  },
  editedAt: {
    type: 'date',
    default: null
  },
  isEdited: {
    type: 'boolean',
    default: false
  },
  createdAt: {
    type: 'date',
    default: 'now'
  }
};

// API Response Schema
export const ApiResponseSchema = {
  success: {
    type: 'boolean',
    required: true
  },
  message: {
    type: 'string',
    required: false
  },
  data: {
    type: 'any',
    required: false
  },
  errors: {
    type: 'array',
    required: false
  },
  count: {
    type: 'number',
    required: false
  }
};