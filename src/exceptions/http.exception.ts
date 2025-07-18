export class HttpException extends Error {
  public status: number;
  public message: string;
  public details: Object;

  constructor(status: number, message: string, details: Object) {
    super(message);
    this.status = status;
    this.message = message;
    this.details = details;
  }
}
