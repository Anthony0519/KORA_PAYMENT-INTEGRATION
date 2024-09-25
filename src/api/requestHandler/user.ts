import { RequestHandler } from 'express'
import { responseHandler } from '../../core/helpers/utilities'
import { validateSignUp, validateLogin, validateUserUpdate } from '../../core/validation/user'
import {
    UserRegistration,
    Login,
    getOneUser,
    updateUser,
    upload,
    userLogout,
} from '../../core/controllers/user'
import { ResponseMessage } from '../../core/constant/successResponse'

// GET THE REGISTRATION DETAILS
export const registerUser: RequestHandler = async (
    req,
    res,
    next,
): Promise<void> => {
    try {
        // validete the user's details
        const validateDetails = validateSignUp(req.body)

        // register the user
        const response = await UserRegistration(validateDetails)

        // return response
        res.json(responseHandler(response, ResponseMessage.SuccessfulRegistration))
    } catch (error) {
        next(error)
    }
}

// GET THE LOGIN DETAILS
export const login: RequestHandler = async (
    req,
    res,
    next
): Promise<void> => {
    try {
        // validte the login details
        const validateInput = validateLogin(req.body)
        // log the user in
        const result = await Login(validateInput)
        // return response
        res.json(responseHandler(result, ResponseMessage.SuccessfulLogin))
    } catch (error) {
        next(error)
    }
}

// GET THE USER'S ID
export const getOne: RequestHandler = async (
    req,
    res,
    next
): Promise<void> => {
    try {
        // pass the user id the to find the user
        const user = await getOneUser(res.locals.user.userId)

        // return response 
        res.json(responseHandler(user, ResponseMessage.UserProfile))

    } catch (error) {
        next(error)
    }
}

// GET UPDATE DETAILS
export const updateProfile: RequestHandler = async (
    req,
    res,
    next
): Promise<void> => {
    try {
        // validate the information to be updated
        const validateData = validateUserUpdate(req.body)
        // pass the user information that is to be updated
        const update = await updateUser(
            validateData,
            res.locals.user.userId,
        )

        // Success response
        res.json(responseHandler(update, ResponseMessage.UpdateUser))

    } catch (error) {
        next(error)
    }
}

// PASS THE IMAGE 
export const addImage: RequestHandler = async (
    req,
    res,
    next
): Promise<void> => {
    try {

        // pass the image to the creation func
        const image = await upload(
            req.file?.path as string,
            res.locals.user.userId
        )

        // throw success response
        res.json(responseHandler(image, "IMAGE UPLODED SUCCESSFUL"))
    } catch (error) {
        next(error)
    }
}

// PASS THE USER TOKEN FOR LOGOUT
export const logout:RequestHandler=async(
    req,
    res,
    next
):Promise<void>=>{
    try{

        // pass the user toke to the logout function
        const user = await userLogout(res.locals.user)

        // return success message
        res.json(responseHandler(user,ResponseMessage.LogoutSuccessful))

    }catch(error){
        next(error)
    }
}