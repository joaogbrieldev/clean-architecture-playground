import { inject } from "../di/Registry";
import HttpClient from "../http/HttpClient";

export default interface PaymentGateway {
    getTransactionByRideId (rideId: string): Promise<GetTransactionByRideIdOutput>;
}

export class PaymentGatewayHttp implements PaymentGateway {
	@inject("httpClient")
	httpClient!: HttpClient;

    constructor () {
    }

    async getTransactionByRideId(rideId: string): Promise<GetTransactionByRideIdOutput> {
        return this.httpClient.get(`http://localhost:3001/rides/${rideId}/transactions`);
    }

}

type GetTransactionByRideIdOutput = {
    transactionId: string,
	amount: number,
	status: string
}