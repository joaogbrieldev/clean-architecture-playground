import RideRepository from "../../infra/repository/RideRepository";

export class StartRide {
  constructor(readonly rideRepository: RideRepository) {}
  async execute(input: Input) {
    const ride = await this.rideRepository.getRideById(input.rideId);
    ride.start();
    await this.rideRepository.updateRide(ride);
  }
}
export type Input = {
  rideId: string;
};
