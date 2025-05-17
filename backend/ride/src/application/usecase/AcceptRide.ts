import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import Queue from "../../infra/queue/Queue";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
	@inject("accountGateway")
	accountGateway!: AccountGateway;
	@inject("rideRepository")
	rideRepository!: RideRepository;
	@inject("queue")
	queue!: Queue;
		
	constructor () {
	}
	
	async execute (input: Input) {
		const account = await this.accountGateway.getAccountById(input.driverId);
		if (!account.isDriver) throw new Error("Account must be from a driver");
		const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(input.driverId);
		if (hasActiveRide) throw new Error("Passenger already have an active ride");
		const ride = await this.rideRepository.getRideById(input.rideId);
		ride.accept(input.driverId);
		await this.rideRepository.updateRide(ride);
		await this.queue.publish("rideAccepted", { rideId: ride.getRideId(), driverName: account.name });
	}
}

type Input = {
	rideId: string,
	driverId: string
}