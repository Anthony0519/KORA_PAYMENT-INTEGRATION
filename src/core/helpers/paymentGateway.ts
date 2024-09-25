import InternalServerError from "../errors/internalServerError";
import variable from '../envVariables/environment'
import { BankVerification, InitializePayinReq, InitializePayoutReq, PaymentGateway, QueryTransaction } from "../interfaces/transaction";

const API_KEY = variable.API_KEY;


export const InitializePayin = async (
    body: InitializePayinReq,
    userData: { [key: string]: any }
): Promise<PaymentGateway<object>> => {
    try {

        const URL = 'https://api.korapay.com/merchant/api/v1/charges/initialize'

        const data = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: body.amount,
                redirect_url: 'https://tour-haven-appli.vercel.app',
                currency: body.currency,
                reference: userData.ref,
                narration: body.narration ? `${body.narration}` : "nil",
                channels: [
                    'card',
                    'bank_transfer',
                ],
                default_channel: 'card',
                customer: {
                    name: userData.name,
                    email: userData.email,
                },
                notification_url: 'https://tour-haven-application.vercel.app',
                metadata: {
                    user_id: userData.id,
                }
            })
        });

        console.log(data)

        const response = await data.json()
        console.log(response)
        return { data: response.data }
 
    } catch (error: any) {
        throw new InternalServerError('An error occoured: ', error.message)
    }
}

export const queryCharge = async (
    body: QueryTransaction,
): Promise<PaymentGateway<object>> => {
    try {

        const URL = `https://api.korapay.com/merchant/api/v1/charges/${body.transaction_reference}`

        const data = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const response = await data.json()
        return { data: response }

    } catch (error: any) {
        throw new InternalServerError('An error occoured: ', error.message)
    }
}

export const InitializePayout = async (
    body: InitializePayoutReq,
    userData: { [key: string]: any }
): Promise<PaymentGateway<object>> => {
    try {

        const URL = 'https://api.korapay.com/merchant/api/v1/transactions/disburse'

        const data = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                reference: userData.ref,
                destination: {
                    type: 'bank_transfer',
                    amount: body.amount,
                    currency: 'NGN',
                    narration: body.narration ? `${body.narration}` : null,
                    bank_account: {
                        bank: body.bank,
                        account: body.account
                    },
                    customer: {
                        name: userData.name,
                        email: userData.email
                    }
                }
            })
        })

        const response = await data.json()
        return { data: response }

    } catch (error: any) {
        throw new InternalServerError('An error occoured: ', error.message)
    }
}

export const verifyPayout = async (
    body: QueryTransaction,
): Promise<PaymentGateway<object>> => {
    try {

        const URL = `https://api.korapay.com/merchant/api/v1/transactions/${body.transaction_reference}`

        const data = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'content-type': 'application/json'
            }
        })

        const response = await data.json()
        return { data: response }

    } catch (error: any) {
        throw new InternalServerError('An error occoured: ', error.message)
    }
}

export const verifyBank = async (
    body: BankVerification
): Promise<PaymentGateway<object>> => {
    try {

        const URL = 'https://api.korapay.com/merchant/api/v1/misc/banks/resolve'

        const data = await fetch(URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                bank: body.bank,
                account: body.account,
                currency: 'NGN'
            })
        })

        const response = await data.json()
        return { data: response }
    } catch (error: any) {
        throw new InternalServerError('An error occoured: ', error.message)
    }
}