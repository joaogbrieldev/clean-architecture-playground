import DatabaseConnection from "../../infra/database/DatabaseConnection";
import { inject } from "../../infra/di/Registry";

export default class GetRideCQRS {
    @inject("connection")
    connection!: DatabaseConnection;

    async execute (rideId: string): Promise<Output> {
        console.time("b");
        const [data] = await this.connection.query(`
            select
                *
            from
                ccca.ride_projection
            where
                ride_id = $1
        `, [rideId]);
        console.timeEnd("b");
        return data;
    }
}

type Output = {
	rideId: string,
	passengerId: string,
	passengerName: string,
	driverId?: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number,
	fare: number,
	distance: number,
	status: string,
	date: Date,
	transactionId?: string,
	transactionAmount?: number,
	transactionStatus?: string,
}