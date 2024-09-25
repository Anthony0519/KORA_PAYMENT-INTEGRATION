import { NextFunction, Request, Response } from "express";
import AuthorizationError from "../../core/errors/AuthorizationError";
import { verifyToken } from "../../core/helpers/tokenHandler";
import { User } from "../../core/models/user";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const AuthHeaders = req.header('Authorization')
        const token = AuthHeaders?.split(" ")[1]

        if(!token){
            const error = new Error('Authentication error')
            const authorizationError = new AuthorizationError(
                'Authorization denied. No token provided',
                error
            )
            throw authorizationError
        }

        const decodeToken = verifyToken(token)

        const user = await User.findOne({ where: {id: decodeToken.userId }})
        if (!user) {
            const error = new Error('not_authenticated');
            const authorizationError = new AuthorizationError(
              'Authorization denied. User not found',
              error
            );
            throw authorizationError;
          }
          res.locals.user = decodeToken;
          next();
    } catch (error) {
        next(error)
    }
}