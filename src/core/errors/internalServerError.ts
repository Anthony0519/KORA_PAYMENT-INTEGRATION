import DomainError from './domainError';
import { Errors } from '../constant/errorResponse';

export default class InternalServerError extends DomainError {
  protected errorName = 'server_error';

  protected httpCode = 500;

  public constructor(
    message: string = Errors.SERVER_ERROR,
    error: Error,
    data: any = null,
    success = false,
  ) {
    super(message, error, data, success);
    Error.captureStackTrace(this, this.constructor)
  }
}
