import pgp from "pg-promise";
import { sendRequest } from "../src/signup";

const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

beforeEach(async () => {
  await connection.query(
    "DELETE FROM ccca.account WHERE email IN ('john@example.com', 'isis@example.com', 'teste@example.com', 'teste2@example.com')"
  );
});

afterAll(async () => {
  await connection.$pool.end();
});

test("Deve retornar -4 se user já existe", async () => {
  const req = {
    body: {
      name: "John Doe",
      email: "john@example.com",
      cpf: "97456321558",
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    },
  };

  const id = crypto.randomUUID();

  await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7)",
    [
      id,
      req.body.name,
      req.body.email,
      req.body.cpf,
      req.body.carPlate,
      req.body.isDriver,
      req.body.password,
    ]
  );

  await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7)",
    [
      crypto.randomUUID(),
      req.body.name,
      req.body.email,
      req.body.cpf,
      req.body.carPlate,
      req.body.isDriver,
      req.body.password,
    ]
  );

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  await sendRequest(req, res);

  expect(res.json).toHaveBeenCalledWith({ message: -4 });
});

test("Deve retornar -3 se nome é inválido", async () => {
  const req = {
    body: {
      name: "A",
      email: "isis@example.com",
      cpf: "97456321558",
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  await sendRequest(req, res);

  expect(res.json).toHaveBeenCalledWith({ message: -3 });
});

test("Deve retornar -2 se cpf é inválido", async () => {
  const req = {
    body: {
      name: "John Doe",
      email: "teste@example.com",
      cpf: null,
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  await sendRequest(req, res);

  expect(res.json).toHaveBeenCalledWith({ message: -1 });
});

test("Deve retornar sucesso", async () => {
  const req = {
    body: {
      name: "John Doe",
      email: "teste2@example.com",
      cpf: "97456321558",
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await sendRequest(req, res);

  expect(res.json).toHaveBeenCalledWith({
    accountId: expect.any(String),
  });
});
