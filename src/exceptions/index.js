// Base Application Exception
export class AppException extends Error {
  constructor(message, statusCode = 500, errorCode = null, details = null) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.timestamp = new Date().toISOString();

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

// Validation Exception
export class ValidationException extends AppException {
  constructor(message, details = null) {
    super(message, 400, "VALIDATION_ERROR", details);
  }
}

// Not Found Exception
export class NotFoundException extends AppException {
  constructor(resource, identifier = null) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}

// Conflict Exception (for duplicate resources)
export class ConflictException extends AppException {
  constructor(resource, field, value) {
    const message = `${resource} with ${field} '${value}' already exists`;
    super(message, 409, "CONFLICT");
  }
}

// Database Exception

export class DatabaseException extends AppException {
  constructor(message, originalError = null) {
    super(message, 500, "DATABASE_ERROR");
    this.originalError = originalError;
  }
}

// Unauthorized Exception

export class UnauthorizedException extends AppException {
  constructor(message = "Unauthorized access") {
    super(message, 401, "UNAUTHORIZED");
  }
}

// Forbidden Exception

export class ForbiddenException extends AppException {
  constructor(message = "Access forbidden") {
    super(message, 403, "FORBIDDEN");
  }
}

// Bad Request Exception

export class BadRequestException extends AppException {
  constructor(message = "Bad request") {
    super(message, 400, "BAD_REQUEST");
  }
}
