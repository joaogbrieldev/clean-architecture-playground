import AcceptRide from "../../src/application/usecase/AcceptRide";
import FinishRide from "../../src/application/usecase/FinishRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import StartRide from "../../src/application/usecase/StartRide";
import UpdatePosition from "../../src/application/usecase/UpdatePosition";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../../src/infra/database/DatabaseConnection";
import Registry from "../../src/infra/di/Registry";
import AccountGateway, {
  AccountGatewayHttp,
} from "../../src/infra/gateway/AccountGateway";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import ORM from "../../src/infra/orm/ORM";
import { RabbitMQAdapter } from "../../src/infra/queue/Queue";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let accountGateway: AccountGateway;
let finishRide: FinishRide;

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

beforeEach(async () => {
  Registry.getInstance().provide("httpClient", new AxiosAdapter());
  connection = new PgPromiseAdapter();
  Registry.getInstance().provide("connection", connection);
  accountGateway = new AccountGatewayHttp();
  const queue = new RabbitMQAdapter();
  await queue.connect();
  Registry.getInstance().provide("queue", queue);
  Registry.getInstance().provide("accountGateway", accountGateway);
  Registry.getInstance().provide("orm", new ORM());
  Registry.getInstance().provide(
    "rideRepository",
    new RideRepositoryDatabase()
  );
  Registry.getInstance().provide(
    "positionRepository",
    new PositionRepositoryDatabase()
  );
  requestRide = new RequestRide();
  acceptRide = new AcceptRide();
  startRide = new StartRide();
  updatePosition = new UpdatePosition();
  finishRide = new FinishRide();
  getRide = new GetRide();
});

test("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);

  expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
  expect(outputGetRide.passengerName).toBe(inputSignup.name);
  expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
  expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
  expect(outputGetRide.status).toBe("requested");
  expect(outputGetRide.fare).toBe(0);
  expect(outputGetRide.distance).toBe(0);
});

test("Não deve solicitar uma corrida se a conta não for de um passageiro", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Account must be from a passenger")
  );
});

test("Não pode solicitar uma corrida se já tiver outra ativa", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignup = await accountGateway.signup(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  await requestRide.execute(inputRequestRide);
  await expect(() => requestRide.execute(inputRequestRide)).rejects.toThrow(
    new Error("Passenger already have an active ride")
  );
});

afterEach(async () => {
  await connection.close();
});
