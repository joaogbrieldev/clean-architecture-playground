import AccountRepository from "../../AccountRepository";
import Ride from "../../Ride";
import RideRepository from "../../RideRepository";

export default class RequestRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository
  ) {}

  async execute(input: Input) {
    const accountData = await this.accountRepository.getAccountById(
      input.passengerId
    );
    if (!accountData.isPassenger)
      throw new Error("Account must be from a passenger");
    const hasActiveRide = await this.rideRepository.hasActiveRideByPassengerId(
      input.passengerId
    );
    if (hasActiveRide) throw new Error("Passenger already have an active ride");
    const ride = Ride.create(
      input.passengerId,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );
    await this.rideRepository.saveRide(ride);
    return {
      rideId: ride.rideId,
    };
  }
}

type Input = {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
};
