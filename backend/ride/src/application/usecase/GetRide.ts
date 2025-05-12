import DistanceCalculator from "../../domain/service/DistanceCalculator";
import { inject } from "../../infra/di/Registry";
import AccountGateway from "../../infra/gateway/AccountGateway";
import PositionRepository from "../../infra/repository/PositionRepository";
import RideRepository from "../../infra/repository/RideRepository";
import TransactionRepository from "../../infra/repository/TransactionRepository";

export default class GetRide {
  @inject("accountGateway")
  accountGateway!: AccountGateway;
  @inject("rideRepository")
  rideRepository!: RideRepository;
  @inject("positionRepository")
  positionRepository!: PositionRepository;
  @inject("transactionRepository")
  transactionRepository!: TransactionRepository;

  constructor() {}

  async execute(rideId: string): Promise<Output> {
    const ride = await this.rideRepository.getRideById(rideId);
    const passengerAccount = await this.accountGateway.getAccountById(
      ride.getPassengerId()
    );
    let distance;
    let transaction;
    if (ride.getStatus() === "completed") {
      distance = ride.getDistance();
      transaction = await this.transactionRepository.getTransactionByRideId(
        rideId
      );
    } else {
      const positions = await this.positionRepository.listByRideId(rideId);
      distance =
        DistanceCalculator.calculateDistanceBetweenPositions(positions);
    }

    return {
      rideId: ride.getRideId(),
      passengerId: ride.getPassengerId(),
      driverId: ride.getDriverId(),
      fromLat: ride.getFrom().getLat(),
      fromLong: ride.getFrom().getLong(),
      toLat: ride.getTo().getLat(),
      toLong: ride.getTo().getLong(),
      fare: ride.getFare(),
      distance,
      status: ride.getStatus(),
      date: ride.date,
      passengerName: passengerAccount.name,
      transactionId: transaction?.getTransactionId(),
      transactionAmount: transaction?.amount,
      transactionStatus: transaction?.status,
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
  transactionId?: string;
  transactionAmount?: number;
  transactionStatus?: string;
};
