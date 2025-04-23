import AcceptRide from "../src/application/usecase/AcceptRide";
import GetAccount from "../src/application/usecase/GetAccount";
import GetRide from "../src/application/usecase/GetRide";
import RequestRide from "../src/application/usecase/RequestRide";
import Signup from "../src/application/usecase/Signup";
import { StartRide } from "../src/application/usecase/StartRide";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "../src/infra/database/DatabaseConnection";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepository";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

let connection: DatabaseConnection;
let signup: Signup;
let getAccount: GetAccount;
let requestRide: RequestRide;
let getRide: GetRide;
let startRide: StartRide;
let acceptRide: AcceptRide;

beforeEach(() => {
  // const accountRepository = new AccountRepositoryMemory();
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const positionRepository = new PositionRepositoryDatabase(connection);

  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accountRepository, mailerGateway);
  getAccount = new GetAccount(accountRepository);
  requestRide = new RequestRide(accountRepository, rideRepository);
  getRide = new GetRide(accountRepository, rideRepository, positionRepository);
  startRide = new StartRide(rideRepository);
  acceptRide = new AcceptRide(accountRepository, rideRepository);
});

test("Deve aceitar uma corrida", async function () {
  const inputSignupPassenger = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignupPassenger = await signup.execute(inputSignupPassenger);

  const inputSignupDriver = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isDriver: true,
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
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
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe("in_progress");
});

afterEach(async () => {
  await connection.close();
});
