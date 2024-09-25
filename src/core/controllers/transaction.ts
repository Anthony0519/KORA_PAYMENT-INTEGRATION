import { 
    InitializePayinReq,
    PayinRes,
    InitializePayoutReq,
    PayoutRes,
    PaymentGateway,
    WebhookRes,
    BankVerification
} from "../interfaces/transaction";
import { User, Transaction } from '../models'
import ResourceNotFound from '../errors/resourceNotFoundError'
import BadRequestError from '../errors/badRequestError'
import { generateReference } from '../helpers/reference'
import { InitializePayin, InitializePayout, verifyBank} from "../helpers/paymentGateway";
import { PayinUpdate, payoutUpdate} from "../helpers/userUpdates";
import { logger } from "../utils/logger";

// INITIALIZE CHARGE(DEPOSITE)
export const InitializeCharge = async(
    id: number,
    body:InitializePayinReq
):Promise<PayinRes<object>>=>{
    //   find the user with the id logged in
    const user = await User.findByPk(id)

    if (!user) {
        const error = new Error()
        throw new ResourceNotFound("User not found", error)
    }

    // get the abbriviation of the user first and last letter of the user's fullname each
    const userFullname = user.fullName.split(' ')
    const getFirstAndLastLetter1 = userFullname[0].slice(0,1).toUpperCase() + userFullname[0].slice(-1).toUpperCase()
    const getFirstAndLastLetter2 = userFullname[1].slice(0,1).toUpperCase() + userFullname[1].slice(-1).toUpperCase()
    const abbName = getFirstAndLastLetter1 + getFirstAndLastLetter2

    const generate = generateReference(10)

    const ref = `${abbName}-${generate}`
    
    // extract the datas needed from the user found
    const userData = {
        id: user.id,
        email: user.email,
        name: user.fullName,
        ref: ref
    }

    // initialize the payment
    const response = await InitializePayin(body,userData)

    // calculat the transaction data and time
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours()+1)
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')

    // extractract the needed data and save
     await Transaction.create({
        userId: id,
        amount: body.amount,
        status: 'pending',
        transaction_reference: ref,
        DateTime:formattedDate,
    })

    // logger.info(response)
    logger.info('Successfull')
    return {message:"Pay in successful", data: response.data}
}

export const Payout = async(
    id:number,
    body:InitializePayoutReq
): Promise<PayoutRes>=>{

    // find the user making the transfer
    const user =  await User.findByPk(id)

    if (!user) {
        const error = new Error()
        throw new ResourceNotFound("User not found", error)
    }

    // get the abbriviation of the user first and last letter of the user's fullname each
    const userFullname = user.fullName.split(' ')
    const getFirstAndLastLetter1 = userFullname[0].slice(0,1).toUpperCase() + userFullname[0].slice(-1).toUpperCase()
    const getFirstAndLastLetter2 = userFullname[1].slice(0,1).toUpperCase() + userFullname[1].slice(-1).toUpperCase()
    const abbName = getFirstAndLastLetter1 + getFirstAndLastLetter2

    const generate = generateReference(10)

    const ref = `${abbName}-${generate}`

    const userData = {
        id: user.id,
        email: user.email,
        name: user.fullName,
        ref: ref
    }

    // initialize the payout
    const response = await InitializePayout(body,userData)

    // calculat the transaction data and time
    let currentDate = new Date();
    currentDate.setHours(currentDate.getHours()+1)
    const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ')

    // extractract the needed data and save
     await Transaction.create({
        userId: id,
        amount: body.amount,
        status: 'pending',
        transaction_reference: ref,
        DateTime:formattedDate,
    })

    logger.info(response.data)
    logger.info("Payout success")
    return {
        message:"Payout successfull",
        sender: user.fullName,
        receiver:body.account,
        receiverBank:body.bank
    }
} 

export const webhook = async(
    body: WebhookRes
):Promise<PaymentGateway<object>>=>{

    const {reference, amount, status, event} = body

    if (event === 'charge.success' || event === 'charge.failed') {
       const updateBalance = await PayinUpdate(reference, amount, status);
        return updateBalance
      } else if (event === 'transfer.success' || event === 'transfer.failed') {
        const updateBalance = await payoutUpdate(reference, amount, status);
        return updateBalance
      } else {
        const error = new Error()
        throw new BadRequestError("unhandled event", error)
      }

}

export const BankDetails = async(
    body: BankVerification
):Promise<PaymentGateway<object>>=>{

    // pass the details to the verify func
    const response = await verifyBank(body)

    // return the response
    logger.info('success')
    return {data: response.data}
}