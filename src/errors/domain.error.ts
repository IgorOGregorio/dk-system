export class DomainError extends Error {
  public readonly details: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.details = details;
    // Maintains proper stack trace in V8
    Error.captureStackTrace(this, this.constructor);
  }
}

export class TopicNotFoundError extends DomainError {
  constructor(topicId: string) {
    super("Topic not found", { topicId });
  }
}

export class UserVersionNotFoundError extends DomainError {
  constructor(version: string) {
    super(`User version ${version} not found.`, { version });
  }
}
