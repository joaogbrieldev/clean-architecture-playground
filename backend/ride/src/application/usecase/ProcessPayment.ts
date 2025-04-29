import Transaction from "../../domain/entity/Transaction";

export default class ProcessPayment {
  constructor(readonly transactionRepository: TransactionRepository) {}
  async execute(input: Input): Promise<Output> {
    const transaction = Transaction.create(input.rideId, input.amount);
    await this.transactionRepository.save(transaction);
    return {
      transactionId: transaction.getTransactionId(),
    };
  }
}
type Input = {
  rideId: string;
  amount: number;
};
type Output = {
  transactionId: string;
};
