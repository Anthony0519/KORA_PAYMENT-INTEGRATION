import joi from "joi";
import { validate } from "../helpers/utilities";
import { BankVerification, InitializePayinReq, InitializePayoutReq } from "../interfaces/transaction";

const { object, string } = joi.types()

export const validateChargeDetails = (
    requestData: { [key: string]: any },
): InitializePayinReq => {
    return validate(
        requestData,
        object.keys({
            amount: string.required(),
            currency: string.min(3).required()
        })
    )
}

export const validatePayoutDetails = (
    requestData: { [key: string]: any },
): InitializePayoutReq => {
    return validate(
        requestData,
        object.keys({
            amount: string.required(),
            bank: string.min(3).required(),
            account: string.max(10).required(),
            narration: string.max(50)
        })
    )
}

export const validateBankVerification = (
    requestData: { [key: string]: any },
): BankVerification => {
    return validate(
        requestData,
        object.keys({
            bank: string.min(3).required(),
            account: string.max(10).required()
        })
    )
}