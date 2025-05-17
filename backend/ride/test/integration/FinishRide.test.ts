import GetRideCQRS from "../../src/application/query/GetRideCQRS";
import GetRideQuery from "../../src/application/query/GetRideQuery";
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
import PaymentGateway, {
  PaymentGatewayHttp,
} from "../../src/infra/gateway/PaymentGateway";
import { AxiosAdapter } from "../../src/infra/http/HttpClient";
import ORM from "../../src/infra/orm/ORM";
import { RabbitMQAdapter } from "../../src/infra/queue/Queue";
import { PositionRepositoryDatabase } from "../../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../../src/infra/repository/RideRepository";

let connection: DatabaseConnection;
let requestRide: RequestRide;
let getRide: GetRide;
let getRideQuery: GetRideQuery;
let getRideCQRS: GetRideCQRS;
let acceptRide: AcceptRide;
let startRide: StartRide;
let updatePosition: UpdatePosition;
let accountGateway: AccountGateway;
let finishRide: FinishRide;
let paymentGateway: PaymentGateway;

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
  Registry.getInstance().provide("accountGateway", accountGateway);
  paymentGateway = new PaymentGatewayHttp();
  Registry.getInstance().provide("paymentGateway", paymentGateway);
  const queue = new RabbitMQAdapter();
  await queue.connect();
  Registry.getInstance().provide("queue", queue);
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
  getRideQuery = new GetRideQuery();
  getRideCQRS = new GetRideCQRS();
});

test("Deve finalizar uma corrida em horário comercial", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(
    inputSignupPassenger
  );
  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date("2023-03-01T10:00:00"),
  };
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date("2023-03-01T10:30:00"),
  };
  await updatePosition.execute(inputUpdatePosition2);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };
  await finishRide.execute(inputFinishRide);
  await sleep(200);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("completed");
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(21);
});

test("Deve finalizar uma corrida no domingo", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(
    inputSignupPassenger
  );
  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date("2024-12-08T10:00:00"),
  };
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date("2024-12-08T10:30:00"),
  };
  await updatePosition.execute(inputUpdatePosition2);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };
  await finishRide.execute(inputFinishRide);
  await sleep(200);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("completed");
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(50);
});

test("Deve finalizar uma corrida em horário noturno", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(
    inputSignupPassenger
  );
  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date("2023-03-01T23:00:00"),
  };
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date("2023-03-01T23:30:00"),
  };
  await updatePosition.execute(inputUpdatePosition2);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };
  await finishRide.execute(inputFinishRide);
  await sleep(200);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("completed");
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(39);
});

test("Deve finalizar uma corrida em horário comercial", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignupPassenger = await accountGateway.signup(
    inputSignupPassenger
  );
  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    fromLat: -27.584905257808835,
    fromLong: -48.545022195325124,
    toLat: -27.496887588317275,
    toLong: -48.522234807851476,
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await acceptRide.execute(inputAcceptRide);
  const inputStartRide = {
    rideId: outputRequestRide.rideId,
  };
  await startRide.execute(inputStartRide);
  const inputUpdatePosition1 = {
    rideId: outputRequestRide.rideId,
    lat: -27.584905257808835,
    long: -48.545022195325124,
    date: new Date("2023-03-30T10:00:00"),
  };
  await updatePosition.execute(inputUpdatePosition1);
  const inputUpdatePosition2 = {
    rideId: outputRequestRide.rideId,
    lat: -27.496887588317275,
    long: -48.522234807851476,
    date: new Date("2023-03-30T10:30:00"),
  };
  await updatePosition.execute(inputUpdatePosition2);
  const inputFinishRide = {
    rideId: outputRequestRide.rideId,
  };
  await finishRide.execute(inputFinishRide);
  await sleep(500);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("completed");
  expect(outputGetRide.distance).toBe(10);
  expect(outputGetRide.fare).toBe(1);
  expect(outputGetRide.transactionStatus).toBe("waiting_payment");
});

afterEach(async () => {
  await connection.close();
});
