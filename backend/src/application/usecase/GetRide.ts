import DistanceCalculator from "../../domain/service/DistanceCalculator";
import AccountRepository from "../../infra/repository/AccountRepository";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";

export default class GetRide {
  // Usar DAO ao invés de Repository
  constructor(
    readonly accountRepository: AccountRepository,
    readonly rideRepository: RideRepository,
    readonly positionRepository: PositionRepository
  ) {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId);
    const passengerAccount = await this.accountRepository.getAccountById(
      ride.getPassengerId()
    );
    const positions = await this.positionRepository.listByRideId(rideId);
    return {
      rideId: ride.getRideId(),
      passengerId: ride.getPassengerId(),
      driverId: ride.getDriverId(),
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      fare: ride.fare,
      distance: DistanceCalculator.calculateDistanceBetweenPositions(positions),
      status: ride.getStatus(),
      date: ride.date,
      passengerName: passengerAccount.getName(),
    };
  }
}

type Output = {
  rideId: string;
  passengerId: string;
  passengerName: string;
  driverId?: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  fare: number;
  distance: number;
  status: string;
  date: Date;
};
