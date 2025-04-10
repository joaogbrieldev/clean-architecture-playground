import AccountRepository from "../../infra/repository/AccountRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId);
    const passengerAccount = await this.accountRepository.getAccountById(
      ride.passengerId
    );
    return {
      ...ride,
      passengerName: passengerAccount.getName(),
    };
  }
}

type Output = {
  rideId: string;
  passengerId: string;
  passengerName: string;
  driverId: string | null;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  fare: number;
  distance: number;
  status: string;
  date: Date;
};
