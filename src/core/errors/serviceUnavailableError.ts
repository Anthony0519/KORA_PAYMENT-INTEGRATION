import DomainError from './domainError';
import { Errors } from '../constant/errorResponse'

export default class ServiceUnavailableError extends DomainError {
  protected errorName = 'service_unavailable';

  protected httpCode = 503;

  public constructor(
    message: string = Errors.SERVICE_UNAVAILABLE,
    error: Error,
    data: any = null,
    success = false,
  ) {
    super(message, error, data, success);
    Error.captureStackTrace(this, this.constructor)
  }
}
