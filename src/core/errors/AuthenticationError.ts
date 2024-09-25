import DomainError from './domainError'
import { Errors } from '../constant/errorResponse'

export default class authenticationError extends DomainError {
    protected errorName = 'not-authenticated';
    protected httpCode = 401;

    public constructor(
        message: string = Errors.NOT_AUTHENTICATED,
        error: Error | null,
        data: any = null,
        success = false,
    ) {
        super(message, error, data, success);
        Error.captureStackTrace(this, this.constructor)
    }
}