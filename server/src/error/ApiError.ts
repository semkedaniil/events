export class ApiError extends Error {
  public static internal(message: string): ApiError {
    return new ApiError(500, message);
  }

  public static badRequest(message: string): ApiError {
    return new ApiError(404, message);
  }

  public static forbidden(message: string): ApiError {
    return new ApiError(403, message);
  }

  public status: number;


  public constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
}
