import { Data } from "../src/data";
import { signup } from "../src/service";

test("Deve criar uma conta de passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignup = await signup(input);
  const outputGetAccount = await Data.getAccountById(outputSignup.accountId);
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
  const outputSignup = await signup(input);
  const outputGetAccount = await Data.getAccountById(outputSignup.accountId);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.carPlate).toBe(input.carPlate);
  expect(outputGetAccount.isDriver).toBe(input.isDriver);
});

test("Não deve criar uma conta de passageiro com o nome inválido", async function () {
  const input = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await expect(signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta de passageiro com o email inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await expect(signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar uma conta de passageiro com o cpf inválido", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "9745632155",
    password: "123456",
    isPassenger: true,
  };
  await expect(signup(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta de motorista com placa do carro inválida", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    carPlate: "AAA999",
    isDriver: true,
  };
  await expect(signup(input)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Não deve criar uma conta de passageiro com conta duplicada", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  await signup(input);
  await expect(signup(input)).rejects.toThrow(new Error("Duplicated account"));
});

test("Deve criar uma conta de passageiro", async function () {
  const input = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    password: "123456",
    isPassenger: true,
  };
  const outputSignup = await signup(input);
  const outputGetAccount = await Data.getAccountById(outputSignup.accountId);
  console.log(outputGetAccount);
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(input.name);
  expect(outputGetAccount.email).toBe(input.email);
  expect(outputGetAccount.cpf).toBe(input.cpf);
  expect(outputGetAccount.password).toBe(input.password);
  expect(outputGetAccount.isPassenger).toBe(input.isPassenger);
});
