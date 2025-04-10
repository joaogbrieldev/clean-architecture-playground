import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class AcceptRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository
  ) {}
  async execute(rideId: string, driverId: string): Promise<void> {
    const accountData = await this.accountRepository.getAccountById(driverId);
    const ride = await this.rideRepository.getRideById(rideId);
    if (ride.status !== "requested") throw new Error("");

    if (!accountData.isDriver) {
    }
    const hasActiveRide = await this.rideRepository.hasActiveRideByDriverId(
      driverId
    );
    if (hasActiveRide) throw new Error("");
    ride.status = driverId;
  }
}
