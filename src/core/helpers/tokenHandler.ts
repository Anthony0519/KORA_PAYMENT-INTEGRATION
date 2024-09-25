import jwt from 'jsonwebtoken'
import variable from '../envVariables/environment';
import { jwtPayload } from '../interfaces/user';
import AuthenticationError from '../../core/errors/AuthenticationError'

export const generateToken = (
  payload: jwtPayload,
  expiry: string
): string => {
  const token = jwt.sign(
    payload,
    variable.SECRETE,
    { expiresIn: expiry }
  )
  return token as string
}

export const verifyToken = (
  token: string,
): jwtPayload => {
  try {
    const payload = jwt.verify(token, variable.SECRETE);
    return payload as jwtPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AuthenticationError('User logged out... please login to continue', error.TokenExpiredError);
    } else if (error.name === 'JsonWebTokenError') {
      throw new AuthenticationError('Invalid Token', error.JsonWebTokenError);
    } else if (error.name === 'NotBeforeError') {
      throw new AuthenticationError('Token not active', error.NotBeforeError);
    }
    throw new AuthenticationError('Token verification failed', error);
  }
};
