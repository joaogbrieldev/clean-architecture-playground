import Transaction from "../../domain/entity/Transaction";
import { inject } from "../../infra/di/Registry";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class GetTransactionByRideId {
    @inject("transactionRepository")
    transactionRepository!: TransactionRepository;

    constructor () {
    }

    async execute (rideId: string): Promise<Output> {
        const transaction = await this.transactionRepository.getTransactionByRideId(rideId);
        return {
            transactionId: transaction.getTransactionId(),
            rideId: transaction.getRideId(),
            amount: transaction.amount,
            status: transaction.status,
            date: transaction.date
        }
    }
}

type Output = {
    transactionId: string
    rideId: string,
    amount: number,
    status: string,
    date: Date
}
