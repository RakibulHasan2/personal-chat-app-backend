// Utility functions
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};

export const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9);
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

export const createResponse = (success, message, data = null, errors = null) => {
  const response = {
    success,
    message
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (errors !== null) {
    response.errors = errors;
  }
  
  return response;
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};