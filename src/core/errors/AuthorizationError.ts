import DomainError from './domainError';
import { Errors } from '../constant/errorResponse';

export default class AuthorizationError extends DomainError {
  protected errorName = 'conflict';

  protected httpCode = 403;

  public constructor(
    message: string = Errors.NOT_AUTHORIZED,
    error: Error | null,
    data: any = null,
    success = false,
  ) {
    super(message, error, data, success);
    Error.captureStackTrace(this, this.constructor)
  }
}
