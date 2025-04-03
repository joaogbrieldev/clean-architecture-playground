import sinon from "sinon";
import Account from "../src/Account";
import { AccountRepositoryDatabase } from "../src/AccountRepository";
import GetAccount from "../src/GetAccount";
import { MailerGatewayMemory } from "../src/MailerGateway";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(() => {
  // const accountDAO = new AccountDAOMemory();
  const accountDAO = new AccountRepositoryDatabase();
  const mailerGateway = new MailerGatewayMemory();
  signup = new Signup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO);
});

test("Deve criar uma conta de passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignup = await signup.execute(input);
  const outputGetAccount = await getAccount.getAccount(outputSignup.accountId);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve criar uma conta de motorista", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA9999",
    isDriver: true,
  };
  const outputSignup = await signup.execute(input);
  const outputGetAccount = await getAccount.getAccount(outputSignup.accountId);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.carPlate).toBe(input.carPlate);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("Não deve criar uma conta de passageiro com conta duplicada", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await signup.execute(input);
  await expect(signup.execute(input)).rejects.toThrow(
    new Error("Duplicated account")
  );
});

test("Deve criar uma conta de passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignup = await signup.execute(input);
  const outputGetAccount = await getAccount.getAccount(outputSignup.accountId);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});

test("Deve criar uma conta de passageiro com stub", async function () {
  const mailerStub = sinon
    .stub(MailerGatewayMemory.prototype, "send")
    .resolves();
  const accountDAOStub1 = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountByEmail")
    .resolves();
  const accountDAOStub2 = sinon
    .stub(AccountRepositoryDatabase.prototype, "saveAccount")
    .resolves();
  const input = new Account(
    "",
    "John Doe",
    `john.doe${Math.random()}@gmail.com`,
    "97456321558",
    "123456",
    "ABC1234",
    true,
    false
  );
  const accountDAOStub3 = sinon
    .stub(AccountRepositoryDatabase.prototype, "getAccountById")
    .resolves(input);
  const outputSignup = await signup.execute(input);
  const outputGetAccount = await getAccount.getAccount(outputSignup.accountId);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  mailerStub.restore();
  accountDAOStub1.restore();
  accountDAOStub2.restore();
  accountDAOStub3.restore();
});

test("Deve criar uma conta de passageiro com spy", async function () {
  const mailerGatewaySpy = sinon.spy(MailerGatewayMemory.prototype, "send");
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignup = await signup.execute(input);
  const outputGetAccount = await getAccount.getAccount(outputSignup.accountId);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  expect(mailerGatewaySpy.calledOnce).toBe(true);
  expect(mailerGatewaySpy.calledWith(input.email, "Welcome", "...")).toBe(true);
  mailerGatewaySpy.restore();
});

test("Deve criar uma conta de passageiro com mock", async function () {
  const mailerGatewayMock = sinon.mock(MailerGatewayMemory.prototype);
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  mailerGatewayMock
    .expects("send")
    .withArgs(input.email, "Welcome", "...")
    .once()
    .callsFake(() => {
      console.log("abc");
    });
  const outputSignup = await signup.execute(input);
  const outputGetAccount = await getAccount.getAccount(outputSignup.accountId);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
  mailerGatewayMock.verify();
  mailerGatewayMock.restore();
});
