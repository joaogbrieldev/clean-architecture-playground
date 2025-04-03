import AccountDAO from "../../AccountRepository";
import RideDAO from "../../RideDAO";

export default class RequestRide {
  constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) {}

  async execute(input: Input) {
    const accountData = await this.accountDAO.getAccountById(input.passengerId);
    if (!accountData.isPassenger)
      throw new Error("Account must be from a passenger");
    const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(
      input.passengerId
    );
    if (hasActiveRide) throw new Error("Passenger already have an active ride");
    const ride = {
      rideId: crypto.randomUUID(),
      passengerId: input.passengerId,
      fromLat: input.fromLat,
      fromLong: input.fromLong,
      toLat: input.toLat,
      toLong: input.toLong,
      fare: 0,
      distance: 0,
      status: "requested",
      date: new Date(),
    };
    await this.rideDAO.saveRide(ride);
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
