import bcrypt from 'bcrypt'
import { User } from '../models'
import ResourceNotFound from '../errors/resourceNotFoundError'
import BadRequestError from '../errors/badRequestError'
import {
    UserRegReq,
    UserReqRes,
    UserLoginReq,
    UserLoginRes,
    jwtPayload,
    UserProfileData,
    updateUserProfile,
    ImageUploadRequest,
    LogOutUserRes,
} from '../interfaces/user'
import { logger } from '../utils/logger'
import { generateToken } from '../helpers/tokenHandler'
import ConflictError from '../errors/conflictError'
import { Errors } from '../constant/errorResponse'
import cloudinary from '../config/cloudConfig'
import fs from "fs";

// REGISTER A USER
export const UserRegistration = async (
    body: UserRegReq,
): Promise<UserReqRes> => {
    // check if the user already exist
    const userExist = await User.findOne({ where: { email: body.email } })
    if (userExist) {
        const error = new Error()
        throw new ResourceNotFound('user with email already exist', error)
    }

    // hash/hide the password
    const saltPass = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(body.password, saltPass)

    // create the user
    const createUser = await User.create({
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        password: hashPassword,
    })

    logger.info("User Registration Successfull")
    return { message: 'Registration Successfull', user: createUser }
}

// LOG A USER IN
export const Login = async (
    body: UserLoginReq
): Promise<UserLoginRes> => {
    // check if the user is existing
    const user = await User.findOne({ where: { email: body.email } })

    if (!user) {
        const error = new Error()
        throw new ResourceNotFound('Email does not exist', error)
    }

    // check if the password matches
    const checkPassword = bcrypt.compareSync(body.password, user.password)

    if (!checkPassword) {
        const error = new Error()
        throw new BadRequestError('wrong password', error)
    }

    // generate token for user if successfull
    const token = generateToken({ userId: user.id, email: user.email, name: user.fullName }, '1d')

    const userDetails = {
        id: user.id,
        name: user.fullName,
        email: user.email,
        mobile: user.phone,
        admin: user.isAdmin,
        ballance: user.balance,
        token: token
    }

    logger.info('Login Successfull')
    return { message: "Successfully Logged in", user: userDetails }
}

// GET USER PROFILE
export const getOneUser = async (
    ID: number,
): Promise<UserProfileData> => {
    // get the user with the id
    const user = await User.findByPk(ID)

    if (!user) {
        const error = new Error()
        throw new ResourceNotFound("User not found", error)
    }

    // return success message and user details
    logger.info("User Found")
    return user
}

// UPDATE NAME AND NUMBER
export const updateUser = async (
    body: updateUserProfile,
    ID: number,
): Promise<{ [key: string]: any }> => {
    // get the user
    const currentUser = await User.findByPk(ID)

    if (!currentUser) {
        const error = new Error("NOT FOUND")
        throw new ResourceNotFound("No user found", error)
    }

    // get the updated data
    const data: updateUserProfile = {
        fullName: body.fullName || currentUser.fullName,
        phone: body.phone || currentUser.phone
    }

    // perfor the update
    const updatedUser = await User.update(data, { where: { id: ID } })

    if (!updatedUser) {
        const error = new Error("CONFLICT")
        throw new ConflictError(`${Errors.CONFLICT}`, error)
    }

    logger.info("Update successful")
    return updatedUser
}

// ADD IMAGE
export const upload = async (
    file: string,
    ID: number
): Promise<{ [key: string]: any }> => {
    console.log(file)
    // fetch the user performing the action
    const user = await User.findByPk(ID)

    if (!user) {
        const error = new Error("NOT FOUND")
        throw new ResourceNotFound("No user found", error)
    }

    // Delete previous image from Cloudinary if exists
    if (user.image) {
        const oldImage = user.image.split("/").pop()?.split(".")[0]
        if (oldImage) {
            await cloudinary.uploader.destroy(oldImage);
        }
    }

    if (!file) {
        const error = new Error("NOT FOUND")
        throw new ResourceNotFound("image not found", error)
    }

    // upload new image
    const result = await cloudinary.uploader.upload(file, { resource_type: 'image' })

    // Delete the file from the local storage
    fs.unlink(file, (err) => {
        if (err) {
            console.error('Failed to delete local file', err);
        }
    });

    // update the image and save
    user.image = result.secure_url
    await user.save()

    logger.info("UPLOAD SUCCESSFUL")
    return { image: user?.image }
}

// LOG OUT
export const userLogout = async (
    token: jwtPayload,
): Promise<LogOutUserRes> => {
    // find the user attached to the token
    const user = await User.findByPk(token.userId)

    if (!user) {
        const error = new Error("NOT FOUND")
        throw new ResourceNotFound("No user found", error)
    }

    // extract token data from user
    const data: jwtPayload = {
        userId: user.id,
        email: user.email,
        name: user.fullName
    }
    // generate a new token for the user (expired token)
    const newToken = generateToken(data, '1sec')

    // return the new token
    logger.info('Logout successful')
    return { token: newToken }
}