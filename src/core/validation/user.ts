import joi from 'joi'

import { validate } from '../helpers/utilities'
import { UserLoginReq, UserRegReq, updateUserProfile } from '../interfaces/user'

const {object, string} = joi.types()

export const validateSignUp = (requestData:{[key: string]: any}):UserRegReq => {
    return validate(
        requestData,
        object.keys({
            fullName: string.trim().min(3).required(),
            email: string.trim().email().required(),
            password: string.min(6).required(),
            phone: string.min(6).required(),
            // image: string.min(5).optional().allow('').max(255),
        })
    )
}

export const validateLogin = (requestData:{[key: string]: any}):UserLoginReq =>{
    return validate(
        requestData,
        object.keys({
            email: string.trim().email().required(),
            password: string.required(),
          }),
    )
}

export const validateUserUpdate = (requestData:{[key: string]: any}):updateUserProfile => {
    return validate(
        requestData,
        object.keys({
          fullName: string.trim().min(3),
          phone: string.min(20).optional().allow('').max(255)
        }),
      );
}