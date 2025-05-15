import Transaction from "../../domain/entity/Transaction";
import { inject } from "../../infra/di/Registry";
import Queue from "../../infra/queue/Queue";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class ProcessPayment {
  @inject("transactionRepository")
  transactionRepository!: TransactionRepository;
  @inject("queue")
  queue!: Queue;

  constructor() {}

  async execute(input: Input): Promise<Output> {
    console.log("processPayment");
    const transaction = Transaction.create(input.rideId, input.fare);
    await this.transactionRepository.saveTransaction(transaction);
    // interação com gateways de pagamento
    await this.queue.publish("paymentProcessed", {
      rideId: input.rideId,
      transactionId: transaction.getTransactionId(),
      amount: transaction.amount,
      status: transaction.status,
    });
    return {
      transactionId: transaction.getTransactionId(),
    };
  }
}

type Input = {
  rideId: string;
  fare: number;
};

type Output = {
  transactionId: string;
};
