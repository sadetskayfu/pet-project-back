import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function isUniqueConstraintError(error: unknown): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError && error.code === 'P2002';
}

export function isRecordNotFoundError(error: unknown): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError && error.code === 'P2025';
}

export function isInvalidInvocationError(error: unknown): error is Error {
  return error instanceof Error && error.message.includes('Invalid') && error.message.includes('invocation');
}

export function isPrismaError(error: unknown): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}