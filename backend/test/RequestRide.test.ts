import GetAccount from "../src/GetAccount";
import { MailerGatewayMemory } from "../src/MailerGateway";
import { RideDAODatabase } from "../src/RideDAO";
import Signup from "../src/Signup";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import { AccountDAODatabase } from "../src/data";

let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
  // const accountDAO = new AccountDAOMemory();
  const accountDAO = new AccountDAODatabase();
  const rideDAO = new RideDAODatabase();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO);
  requestRide = new RequestRide(accountDAO, rideDAO);
  getRide = new GetRide(rideDAO);
});

test("Deve solicitar uma corrida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };

  const outputSignup = await signup.signup(input);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.55052,
    fromLong: -46.633308,
    toLat: -23.551321,
    toLong: -46.635678,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.rideId).toStrictEqual(outputRequestRide.rideId);
  expect(outputGetRide.passengerId).toStrictEqual(outputSignup.accountId);
  expect(outputGetRide.fromLat).toStrictEqual(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toStrictEqual(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toStrictEqual(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toStrictEqual(inputRequestRide.toLong);
  expect(outputGetRide.status).toStrictEqual("requested");
  expect(outputGetRide.fare).toStrictEqual(0);
  expect(outputGetRide.distance).toStrictEqual(0);
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isDriver: true,
    carPlate: "ABC1234",
  };

  const outputSignup = await signup.signup(input);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.55052,
    fromLong: -46.633308,
    toLat: -23.551321,
    toLong: -46.635678,
  };
  await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Account must be from a passenger")
  );
});

test("Não pode solicitar uma corrida se já tiver outra ativa", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };

  const outputSignup = await signup.signup(input);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -23.55052,
    fromLong: -46.633308,
    toLat: -23.551321,
    toLong: -46.635678,
  };
  await requestRide.execute(inputRequestRide);
  await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Passenger already have an active ride")
  );
});
