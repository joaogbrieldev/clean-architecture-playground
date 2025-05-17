export default class RideCompleted {
    event = "rideCompleted";

    constructor (readonly rideId: string, readonly fare: number, readonly distance: number) {
    }

}
