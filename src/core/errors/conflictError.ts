import DomainError from './domainError';
import { Errors } from '../constant/errorResponse';

export default class ConflictError extends DomainError {
  protected errorName = 'conflict';

  protected httpCode = 400;

  public constructor(
    message: string = Errors.CONFLICT,
    error: Error,
    data: any = null,
    success = false,
  ) {
    super(message, error, data, success);
    Error.captureStackTrace(this, this.constructor)
  }
}
