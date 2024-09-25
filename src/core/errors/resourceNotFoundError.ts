import DomainError from './domainError';
import { Errors } from '../constant/errorResponse';

export default class ResourceNotFound extends DomainError {
  protected errorName = 'resource_not_found';

  protected httpCode = 404;

  public constructor(
    message: string = Errors.RESOURCE_NOT_FOUND,
    error: Error,
    data: any = null,
    success = false,
  ) {
    super(message, error, data, success);
    Error.captureStackTrace(this, this.constructor)
  }
}
