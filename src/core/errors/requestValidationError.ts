import DomainError from './domainError';
import { Errors } from '../constant/errorResponse';

export default class RequestValidationError extends DomainError {
  protected errorName = 'validation_error';

  protected httpCode = 422;

  public constructor(
    message: string = Errors.VALIDATION,
    error: Error,
    data: any = null,
    success = false,
){
   super(message,error,data,success);
   Error.captureStackTrace(this, this.constructor)
}
}
