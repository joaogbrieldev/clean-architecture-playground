import UpdateProjection from "./application/usecase/UpdateProjection";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import Registry from "./infra/di/Registry";
import ORM from "./infra/orm/ORM";
import { RabbitMQAdapter } from "./infra/queue/Queue";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";

// Entry Point - Composition Root

(async () => {
    const queue = new RabbitMQAdapter();
    await queue.connect();
    Registry.getInstance().provide("queue", queue);
    Registry.getInstance().provide("connection", new PgPromiseAdapter());
    const updateProjection = new UpdateProjection();
    queue.consume("rideRequested.updateProjection", async function (data: any) {
        await updateProjection.execute("rideRequested", data);
    });
    queue.consume("rideAccepted.updateProjection", async function (data: any) {
        await updateProjection.execute("rideAccepted", data);
    });
    queue.consume("rideCompleted.updateProjection", async function (data: any) {
        await updateProjection.execute("rideCompleted", data);
    });
    queue.consume("paymentProcessed.updateProjection", async function (data: any) {
        await updateProjection.execute("paymentProcessed", data);
    });
})();
