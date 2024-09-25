import DomainError from './domainError';
import { Errors } from '../constant/errorResponse'

export default class BadRequestError extends DomainError {
  protected errorName = 'bad_request';

  protected httpCode = 400;

  public constructor(
    message: string = Errors.BAD_REQUEST,
    error: Error,
    data: any = null,
    success = false,
  ) {
    super(message, error, data, success);
    Error.captureStackTrace(this, this.constructor)
  }
}
