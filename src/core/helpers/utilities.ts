import joi, {object, ValidationErrorItem} from 'joi'
import { Errors } from '../constant/errorResponse'
import BadRequestError from '../errors/badRequestError'

export const responseHandler = (
    payload: { [key:string]:any } | any[],
    message = "success",
): {status:boolean; message:string; data:any}=>{
    return{
        status:true,
        message,
        data:payload || {}
    }
}

export const getErrorMessage = (item:  ValidationErrorItem): string => {
    let message;
    switch (item.type){
        case `${item.type.split('.')[0]}.only`:
            message = `${item?.context?.value} is not a valid option`
            break;
        case `${item.type.split('.')[0]}.required`:
            message = `${item.path.join('.')} is required`
            break;
        case 'object.min':
            message = `This request should not be empty`
            break;
        case 'string.min':
            message = `${item.path.join('.')} should have atleast ${item?.context?.limit} characters`
            break;
        case 'string.max':
            message = `${item.path.join('.')} should not be more than ${item?.context?.limit} characters`
            break;
        case 'string.length':
            message = `${item.path.join('.')} should only be ${item?.context?.limit} characters, not less, not more`
            break;
        case 'string.alphanum':
            message = `${item.path.join('.')} should contain only alphanumeric characters`
            break;
        case 'string.base':
            message = `${item.path.join('.')} should be a string`
            break;
        default:
            break;                
    }
    return message as string
}

export const buildErrorObject = (
    errors: ValidationErrorItem[],
): Partial <{ message:string; customErrorMessage:string}> => {
    const customErrors:any = {};
    errors.forEach(item => {
        if(!object.prototype.hasOwnProperty.call(customErrors, item.path.join('.'))){
            const customErrorMessage = getErrorMessage(item)

            customErrors[item.path.join('.')] = {
                message: item.message.replace(/['"]+/g, ''),
                customErrorMessage
            }
        }
    })
    return customErrors
}

export const validate = <T>(
    request:{[key: string]: any},
    schema: joi.ObjectSchema<any>,
): T => {
    const validation = schema.validate(request, { abortEarly: false})
    const {value, error} = validation

    if(error){
        const relevantError = new Error('an error occoured');
        throw new BadRequestError(
            Errors.BAD_REQUEST,
            relevantError,
            buildErrorObject(error.details),
            false
        )
    }
    return value
}   