import crypto from "crypto";
import Coord from "../vo/Coord";

export default class Ride {
  private from: Coord;
  private to: Coord;
  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    readonly driverId: string | null,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    readonly fare: number,
    readonly distance: number,
    readonly status: string,
    readonly date: Date
  ) {
    this.from = new Coord(fromLat, fromLong);
    this.to = new Coord(toLat, toLong);
  }

  static create(
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
  ) {
    const rideId = crypto.randomUUID();
    const fare = 0;
    const distance = 0;
    const date = new Date();
    const status = "requested";
    return new Ride(
      rideId,
      passengerId,
      null,
      fromLat,
      fromLong,
      toLat,
      toLong,
      fare,
      distance,
      status,
      date
    );
  }
  getFrom() {
    return this.from;
  }
  getTo() {
    return this.to;
  }
}
