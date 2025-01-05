import { ApiResponse } from '@nestjs/swagger';
import { UnauthorizedException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';

const logger = new Logger('MessagesResponseUtil');

/**
 * Custom Exception for Invalid UUID.
 */
export class InvalidUUIDException extends BadRequestException {
  constructor(field: string, value: string) {
    super(`Invalid UUID format for '${field}': '${value}'. Please provide a valid UUID.`);
  }
}

/**
 * Throws an UnauthorizedException with a custom message.
 * @param message - Custom message for the exception.
 */
export function handleUnauthorizedError(message: string = 'User not authorized') {
  logger.warn(`Unauthorized access attempt: ${message}`);
  throw new UnauthorizedException(message);
}

/**
 * Throws a NotFoundException with a custom entity name and ID.
 * @param entity - The name of the entity (e.g., 'Message').
 * @param id - The ID of the entity that was not found.
 * @param customMessage - Optional custom message for the exception.
 */
export function handleNotFoundError(entity: string, id: string, customMessage?: string) {
  const message = customMessage || `${entity} with id ${id} not found`;
  logger.error(message);
  throw new NotFoundException(message);
}

/**
 * Throws a BadRequestException with a custom message.
 * @param message - Custom message for the exception.
 */
export function handleBadRequestError(message: string = 'Bad request') {
  logger.error(`Bad request: ${message}`);
  throw new BadRequestException(message);
}

/**
 * API Response for Success (200)
 */
export const SuccessResponse = (message: string) => ApiResponse({
  status: 200,
  description: message,
  schema: {
    properties: {
      message: { type: 'string', example: message },
    },
  },
});

/**
 * API Response for Created (201)
 */
export const CreatedResponse = (message: string) => ApiResponse({
  status: 201,
  description: message,
  schema: {
    properties: {
      message: { type: 'string', example: message },
    },
  },
});

/**
 * API Response for Unauthorized (401)
 */
export const UnauthorizedResponse = (message: string = 'Unauthorized: Invalid credentials or token.') => ApiResponse({
  status: 401,
  description: message,
  schema: {
    properties: {
      error: { type: 'string', example: message },
    },
  },
});

/**
 * API Response for Not Found (404)
 */
export const NotFoundResponse = (message: string = 'Resource not found.') => ApiResponse({
  status: 404,
  description: message,
  schema: {
    properties: {
      error: { type: 'string', example: message },
    },
  },
});

/**
 * API Response for Bad Request (400)
 */
export const BadRequestResponse = (message: string = 'Bad request. Invalid parameters or missing data.') => ApiResponse({
  status: 400,
  description: message,
  schema: {
    properties: {
      error: { type: 'string', example: message },
    },
  },
});
