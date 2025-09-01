export class ApiError extends Error {
  statusCode: number;
  type: "api" | "validation";
  errors?: Record<string, string>;

  constructor(
    type: "api" | "validation",
    message: string,
    statusCode: number,
    errors?: Record<string, string>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    if (errors && Object.keys(errors).length > 0) this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static validation(
    errors: Record<string, string>,
    message = "Validation failed"
  ) {
    return new ApiError("validation", message, 422, errors);
  }

  static unauthorized(message = "Invalid credentials") {
    return new ApiError("api", message, 401);
  }

  static forbidden(message = "Access denied") {
    return new ApiError("api", message, 403);
  }

  static notFound(message = "Resorce not found") {
    return new ApiError("api", message, 404);
  }

  static conflict(message = "Resource already exists") {
    return new ApiError("api", message, 409);
  }

  static tooManyRequests(message = "Too many requests") {
    return new ApiError("api", message, 429);
  }
  // สำหรับ 500 - ไม่ควรเปิดเผย error details
  static internal(message = "Internal server error") {
    return new ApiError("api", message, 500);
  }

  static badRequest(message = "Bad request") {
    return new ApiError("api", message, 400);
  }
}
