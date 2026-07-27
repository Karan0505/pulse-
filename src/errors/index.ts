import { GraphQLError } from 'graphql';
import { ERROR_CODES } from '../constants';

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, code: string = ERROR_CODES.INTERNAL_SERVER_ERROR, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, ERROR_CODES.UNAUTHENTICATED, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Permission denied') {
    super(message, ERROR_CODES.FORBIDDEN, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, ERROR_CODES.NOT_FOUND, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(message, ERROR_CODES.BAD_USER_INPUT, 400, details);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, ERROR_CODES.CONFLICT, 409);
  }
}

export const formatGraphQLError = (formattedError: any, error: any) => {
  const originalError = error.originalError;
  if (originalError instanceof AppError) {
    return new GraphQLError(originalError.message, {
      extensions: {
        code: originalError.code,
        http: { status: originalError.statusCode },
        details: originalError.details,
      },
    });
  }
  return formattedError;
};
