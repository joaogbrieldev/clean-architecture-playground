import GetTransactionByRideId from "./application/usecase/GetTransactionByRideId";
import ProcessPayment from "./application/usecase/ProcessPayment";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import { ExpressAdapter } from "./infra/http/HttpServer";
import ORM from "./infra/orm/ORM";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { TransactionRepositoryDatabase } from "./infra/repository/TransactionRepository";

// Entry Point - Composition Root

(async () => {
  const queue = new RabbitMQAdapter();
  await queue.connect();
  Registry.getInstance().provide("queue", queue);
  Registry.getInstance().provide("connection", new PgPromiseAdapter());
  Registry.getInstance().provide("orm", new ORM());
  Registry.getInstance().provide(
    "transactionRepository",
    new TransactionRepositoryDatabase()
  );
  Registry.getInstance().provide("processPayment", new ProcessPayment());
  queue.consume("rideCompleted.processPayment", async function (data: any) {
    await Registry.getInstance().inject("processPayment").execute(data);
  });
  const httpServer = new ExpressAdapter();
  httpServer.register(
    "get",
    "/rides/:{rideId}/transactions",
    async function (params: any, body: any) {
      const getTransactionByRideId = new GetTransactionByRideId();
      const output = await getTransactionByRideId.execute(params.rideId);
      return output;
    }
  );
  httpServer.listen(3001);
})();
