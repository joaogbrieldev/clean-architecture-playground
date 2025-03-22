import RideDAO from "../../RideDAO";

export default class GetRide {
  constructor(readonly rideDAO: RideDAO) {}
  async execute(rideId: any): Promise<Output> {
    const ride = await this.rideDAO.getRideById(rideId);
    return {
      ...ride,
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
