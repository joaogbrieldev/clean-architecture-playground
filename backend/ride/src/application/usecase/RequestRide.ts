import Ride from "../../domain/entity/Ride";
import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import Queue from "../../infra/queue/Queue";
import RideRepository from "../../infra/repository/RideRepository";

export default class RequestRide {
	@inject("accountGateway")
	accountGateway!: AccountGateway;
	@inject("rideRepository")
	rideRepository!: RideRepository;
	@inject("queue")
	queue!: Queue;

	constructor () {
	}
	
	async execute (input: Input) {
		const accountData = await this.accountGateway.getAccountById(input.passengerId);
		if (!accountData.isPassenger) throw new Error("Account must be from a passenger");
		const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(input.passengerId);
		if (hasActiveRide) throw new Error("Passenger already have an active ride");
		const ride = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);
		await this.rideRepository.saveRide(ride);
		await this.queue.publish("rideRequested", { rideId: ride.getRideId(), passengerName: accountData.name });
		return {
			rideId: ride.getRideId()
		}
	}
}

type Input = {
	passengerId: string,
	fromLat: number,
	fromLong: number,
	toLat: number,
	toLong: number
}
