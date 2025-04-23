import Coord from "../vo/Coord";
import UUID from "../vo/UUID";

export class Position {
  private posititionId: UUID;
  private rideId: UUID;
  private coord: Coord;

  constructor(
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    readonly date: Date
  ) {
    this.posititionId = new UUID(positionId);
    this.rideId = new UUID(rideId);
    this.coord = new Coord(lat, long);
  }
  static create(rideId: string, lat: number, long: number) {
    const positionId = UUID.create();
    const date = new Date();
    return new Position(positionId.getValue(), rideId, lat, long, date);
  }

  getPositionId() {
    return this.posititionId.getValue();
  }

  getRideId() {
    return this.rideId.getValue();
  }

  getCoord() {
    return this.coord;
  }
}
