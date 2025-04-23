import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository
  ) {}
  async execute(input: Input): Promise<void> {
    const accountData = await this.accountRepository.getAccountById(
      input.driverId
    );
    if (!accountData.isDriver) throw new Error("Account must be from a driver");
    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(
      input.driverId
    );
    if (hasActiveRide) throw new Error("Passenger already have an active ride");
    const ride = await this.rideRepository.getRideById(input.rideId);
    if (ride.getStatus() !== "requested") throw new Error("");

    ride.accept(input.driverId);
    await this.rideRepository.updateRide(ride);
  }
}
type Input = {
  rideId: string;
  driverId: string;
};
