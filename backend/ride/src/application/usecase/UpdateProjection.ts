import DatabaseConnection from "../../infra/database/DatabaseConnection";
import { inject } from "../../infra/di/Registry";

export default class UpdateProjection {
    @inject("connection")
    connection!: DatabaseConnection;

    async execute (eventName: string, data: any) {
        console.log(eventName);
        const [rideProjection] = await this.connection.query("select * from ccca.ride_projection where ride_id = $1", [data.rideId]);
        if (!rideProjection) {
            await this.connection.query("insert into ccca.ride_projection (ride_id) values ($1)", [data.rideId]);
        }
        if (eventName === "rideRequested") {
            await this.connection.query("update ccca.ride_projection set passenger_name = $1 where ride_id = $2", [data.passengerName, data.rideId]);
        }
        if (eventName === "rideAccepted") {
            await this.connection.query("update ccca.ride_projection set driver_name = $1 where ride_id = $2", [data.driverName, data.rideId]);
        }
        if (eventName === "rideCompleted") {
            await this.connection.query("update ccca.ride_projection set fare = $1, distance = $2 where ride_id = $3", [data.fare, data.distance, data.rideId]);
        }
        if (eventName === "paymentProcessed") {
            await this.connection.query("update ccca.ride_projection set transaction_id = $1, transaction_amount = $2, transaction_status = $3 where ride_id = $4", [data.transactionId, data.amount, data.status,  data.rideId]);
        }
    }
}
