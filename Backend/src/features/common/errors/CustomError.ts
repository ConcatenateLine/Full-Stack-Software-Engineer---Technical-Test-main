export default class CustomError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: string = "CUSTOM_ERROR",
    public readonly details?: Record<string, any>,
    public readonly status?: number
  ) {
    super(message);
    this.name = "CustomError";
  }
}
