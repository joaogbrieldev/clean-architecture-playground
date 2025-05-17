import axios from "axios";
import HttpClient from "../http/HttpClient";

export default interface AccountGateway {
    signup (input: Input): Promise<Output>;
}

export class AccountGatewayHttp implements AccountGateway {

    constructor (readonly httpClient: HttpClient) {
    }

    async signup(input: Input): Promise<Output> {
        const response = await this.httpClient.post("http://localhost:3000/signup", input);
	    return response;
    }

}

export class AccountGatewayMemory implements AccountGateway {

    async signup(input: Input): Promise<Output> {
        return {
            accountId: "123456"
        }
    }

}

type Input = {
    name: string,
	email: string,
	cpf: string,
	password: string,
	isPassenger: boolean,
}

type Output = {
    accountId: string
}
