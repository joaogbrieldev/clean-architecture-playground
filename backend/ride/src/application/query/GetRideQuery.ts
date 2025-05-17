import DatabaseConnection from "../../infra/database/DatabaseConnection";
import { inject } from "../../infra/di/Registry";

export default class GetRideQuery {
    @inject("connection")
    connection!: DatabaseConnection;

    async execute (rideId: string): Promise<Output> {
        console.time("b");
        const [data] = await this.connection.query(`
            select
                r.ride_id,
                r.passenger_id,
                r.driver_id,
                p.name as passenger_name,
                d.name as driver_name,
                r.from_lat,
                r.from_long,
                r.to_lat,
                r.to_long,
                r.fare,
                r.distance,
                r.status,
                r.date,
                t.transaction_id,
                t.amount as transaction_amount,
                t.status as transaction_status
            from
                ccca.ride r
                left join ccca.account p on (r.passenger_id = p.account_id)
                left join ccca.account d on (r.driver_id = d.account_id)
                left join ccca.transaction t on (t.ride_id = r.ride_id)
            where
                r.ride_id = $1
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