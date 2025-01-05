import { UnauthorizedException, NotFoundException, Logger } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

const logger = new Logger('ErrorResponseUtil');

/**
 * Throws an UnauthorizedException with a custom message.
 * @param message - Custom message for the exception.
 */

export function ensureAuthenticated(user: any) {
    if (!user) handleUnauthorizedError();
  }

export function handleUnauthorizedError(message: string = 'User not authorized') {
  logger.warn(`Unauthorized access attempt: ${message}`);
  throw new UnauthorizedException(message);
}

/**
 * Throws a NotFoundException with a custom entity name and ID.
 * @param entity - The name of the entity (e.g., 'User', 'Message').
 * @param id - The ID of the entity that was not found.
 * @param customMessage - Optional custom message for the exception.
 */


export function handleNotFoundError(entity: string, id: string, customMessage?: string) {
  const message = customMessage || `${entity} with id ${id} not found`;
  logger.error(message);
  throw new NotFoundException(message);
}

/**
 * ApiResponse for common scenarios.
 */
export const UnauthorizedResponse = ApiResponse({
    status: 401,
    schema: {
      properties: {
        error: { type: 'string', example: 'Unauthorized: Invalid credentials or token.' },
      },
    },
  });
  
  export const NotFoundResponse = ApiResponse({
    status: 404,
    schema: {
      properties: {
        error: { type: 'string', example: 'User not found.' },
      },
    },
  });

  
  /**
 * 200 Success response with a custom message or data.
 * @param properties - Object schema for the success response data.
 */

  export const SuccessResponse = (properties: any) => ApiResponse({
    status: 201,
    schema: { properties },
  });

  /**
 * 201 Created response with access and refresh tokens.
 */
export const CreatedTokenResponse = ApiResponse({
  status: 201,
  description: 'Access and refresh tokens created successfully.',
  schema: {
    properties: {
      access_token: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTczMDQ1NTUwMiwiZXhwIjoxNzMwNDU5MTAyfQ.9tNFY1GfFshjnkB4SAJzSVVnJmgYgNdarQosv8M0KNU',
      },
      refresh_token: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTczMDQ1NTUwMiwiZXhwIjoxNzMxMDYwMzAyfQ.QF7LyKrhcjyUJ0cr6X9jzIcT3JKrUKgoojBXnfUBQP8',
      },
    },
  },
});