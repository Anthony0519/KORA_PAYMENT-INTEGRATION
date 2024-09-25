import { Request, Response, NextFunction } from 'express';
import { ValidationError, DatabaseError } from 'sequelize';
// import { SequelizeDatabaseErr } from 'sequelize';
import DomainError from '../../core/errors/domainError';
import { logger } from '../../core/utils/logger';
import { Errors } from '../../core/constant/errorResponse';

export const handleErrors = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): Response => {
    if (err instanceof DomainError) {
        return res.status(err.getHttpCode()).send({
            status: err.getStatus(),
            error: err.getName(),
            message: err.message,
            data: err.getData ? err.getData() || {} : {},
        });
    }

    if (err instanceof ValidationError) {
        logger.error('[Database validation error] => ', err.message);
        return res.status(400).send({
            status: false,
            error: 'validation_error',
            message: err.message,
            data: {}
        });
    }
    
    if (err instanceof DatabaseError) {
        logger.error('[SequelizeDatabaseError] => ', err.message);
        return res.status(500).send({
            status: false,
            error: 'database_error',
            message: 'There was a problem with the database.',
            details: err.message,
            data: {}
        });
    }


    logger.error('[Unhandled Error] => ', err)
    return res.status(500).send({
        status: false,
        error: 'server_error',
        message: Errors.SERVER_ERROR,
        data: {}
    })
}