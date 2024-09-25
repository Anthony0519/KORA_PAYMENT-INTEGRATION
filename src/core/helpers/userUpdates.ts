import ConflictError from '../errors/conflictError'
import InternalServerError from '../errors/internalServerError'
import ResourceNotFound from '../errors/resourceNotFoundError'
import { PaymentGateway, TransactionAttributes,  } from '../interfaces/transaction'
import {User,Transaction} from '../models'

export const PayinUpdate=async(
    reference:string,
    amount:number,
    status:string
):Promise<PaymentGateway<object>>=>{
    try {

        // find the transaction with the reference
        const transaction = await Transaction.findOne({where:{transaction_reference:reference}})

        if(!transaction){
            const error = new Error()
            throw new ResourceNotFound("Transaction not found", error)
        }

        // check for the user 
        const user = await User.findByPk(transaction.userId)
        if(!user){
            const error = new Error()
            throw new ResourceNotFound("User not found", error)
        }

        

        // return message if failed
        if (status === "failed") {
            transaction.status = status
            await transaction.save()
            const error = new Error()
            throw new ConflictError("Payment error: ",error)
        }
        // update user balance on success
        user.balance += amount
        await user.save()

        transaction.status = status
        await transaction.save()

        return {data: transaction}

    } catch (error:any) {
        throw new InternalServerError("an error occoured: ", error.message)
    }
}

export const payoutUpdate=async(
    reference: string,
    amount: number,
    status: string
):Promise<PaymentGateway<object>>=>{
    try {

        // find the transaction with the reference
        const transaction = await Transaction.findOne({where:{transaction_reference:reference}})

        if(!transaction){
            const error = new Error()
            throw new ResourceNotFound("Transaction not found", error)
        }

        // get the user's info
        const user = await User.findByPk(transaction.userId)

        if(!user){
            const error = new Error()
            throw new ResourceNotFound("User not found", error)
        }

        // update transaction if failed
        if(status === 'failed'){
            transaction.status = status
            await transaction.save()
            return {data: transaction}
        }

        // update user balance and transaction if successful
        transaction.status = status
        user.balance -= amount
        await user.save()
        await transaction.save()
        return {data: transaction}
        
    } catch (error: any) {
        throw new InternalServerError("an error occoured: ", error.message)
    }
}