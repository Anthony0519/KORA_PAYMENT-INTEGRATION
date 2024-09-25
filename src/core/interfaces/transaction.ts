
export interface InitializePayinReq {
    amount: number;
    currency: string;
    narration?: string;
}

export interface PayinRes<T> {
    message: string,
    data: T
}

export interface TransactionAttributes {
    id: number;
    userId: number;
    amount: number;
    currency?: string;
    status: string;
    transaction_reference: string;
    DateTime: string;
    type?: string;
    sender?: string;
    receipient?: string;
    receipient_bank?: string;
    receipint_account?: string;
}

export interface QueryTransaction {
    transaction_reference: string;
}

export interface InitializePayoutReq {
    amount: number;
    bank: string;
    account: string;
    narration?: string;
}

export interface PayoutRes {
    message: string;
    sender: string;
    receiver: string;
    receiverBank: string;
}

export interface BankVerification {
    bank: string;
    account: string;
}

export interface PaymentGateway<T> {
    data: T
}

export interface WebhookRes{
    event: string;
    reference:string;
    amount:number;
    status:string
}