import { RequestHandler } from 'express'
import { validateChargeDetails, validatePayoutDetails, validateBankVerification} from '../../core/validation/transaction'
import { responseHandler } from '../../core/helpers/utilities'
import {
    InitializeCharge,
    BankDetails,
    Payout,
    webhook
} from '../../core/controllers/transaction'
import { ResponseMessage } from '../../core/constant/successResponse'
import variable from '../../core/envVariables/environment'
import crypto from 'crypto'
export const payIn:RequestHandler = async(
    req,
    res,
    next
):Promise<void>=>{
    try {
        // validate the payload
        const validateData = validateChargeDetails(req.body)

        // initialize the charge
        const response = await InitializeCharge(res.locals.user.userId,validateData)

        res.json(responseHandler(response,ResponseMessage.SuccessfulTransaction))
    } catch (error) {
        next(error)
    }
}

export const payOut:RequestHandler = async(
    req,
    res,
    next
):Promise<void>=>{
    try{

        // validate the input
        const validatePayout = validatePayoutDetails(req.body)

        // process the payout
        const response = await Payout(res.locals.user.userId, validatePayout)

        // return response
        res.json(responseHandler(response, ResponseMessage.Successfulwithdrawal))

    }catch(error){
        next(error)
    }
}

export const verifyBank:RequestHandler = async(
    req,
    res,
    next
):Promise<void>=>{
    try{

        // validate the input
        const validateDetails = validateBankVerification(req.body)

        // process the payout
        const response = await BankDetails(validateDetails)

        // return response
        res.json(responseHandler(response, 'SUCCESSFULL'))

    }catch(error){
        next(error)
    }
}

export const webhookRes:RequestHandler = async(
req,
res,
next
):Promise<void>=>{
    try{

        const hash = crypto.createHmac('sha256', variable.API_KEY).update(JSON.stringify(req.body.data)).digest('hex')
        if(hash === req.headers['x-korapay-signature']) {
            const response = await webhook({
                event:req.body.event,
                reference:req.body.data.reference,
                amount:req.body.data.amount,
                status:req.body.data.status
            })
            // return response
            res.json(responseHandler(response, 'SUCCESSFULL'))
          }

       console.log('invalid payment')

    }catch(error){
        next(error)
    }
}