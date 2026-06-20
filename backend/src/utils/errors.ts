export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export const notFound = (message = "Resource not found") => new AppError(message, 404, "NOT_FOUND");
export const forbidden = (message = "Forbidden") => new AppError(message, 403, "FORBIDDEN");
export const unauthorized = (message = "Unauthorized") => new AppError(message, 401, "UNAUTHORIZED");
