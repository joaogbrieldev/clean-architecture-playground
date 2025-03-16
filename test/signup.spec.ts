import pgp from "pg-promise";
import { sendRequest } from "../src/signup";

const request = require("supertest");
const express = require("express");

describe("POST /signup", () => {
  const sendRequest = jest.fn();

  const app = express();
  app.use(express.json());
  app.post("/signup", async (req: any, res: any) => {
    const input = req.body;
    const result = sendRequest(input);
    try {
      if (typeof result === "number") {
        res.status(422).json({ message: result });
      } else {
        res.json(result);
      }
    } catch {}
  });

  it("deve retornar 422 se sendRequest retornar um número", async () => {
    sendRequest.mockReturnValue(100);

    const response = await request(app)
      .post("/signup")
      .send({ username: "test", password: "123456" });

    expect(response.status).toBe(422);
    expect(response.body).toEqual({ message: 100 });
  });

  it("deve retornar um JSON válido se sendRequest retornar um objeto", async () => {
    sendRequest.mockReturnValue({ success: true });

    const response = await request(app)
      .post("/signup")
      .send({ username: "test", password: "123456" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true });
  });
});

describe("sendRequest function", () => {
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
      name: "John Doe",
      email: "john@example.com",
      cpf: "97456321558",
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    };

    const id = crypto.randomUUID();

    await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        id,
        req.name,
        req.email,
        req.cpf,
        req.carPlate,
        req.isDriver,
        req.password,
      ]
    );

    await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        crypto.randomUUID(),
        req.name,
        req.email,
        req.cpf,
        req.carPlate,
        req.isDriver,
        req.password,
      ]
    );

    const result = await sendRequest(req);

    expect(result).toStrictEqual(-4);
  });

  test("Deve retornar -3 se nome é inválido", async () => {
    const req = {
      name: "A",
      email: "isis@example.com",
      cpf: "97456321558",
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    };

    const result = await sendRequest(req);

    expect(result).toStrictEqual(-3);
  });

  test("Deve retornar -2 se email é inválido", async () => {
    const req = {
      name: "John Doe",
      email: "a",
      cpf: "97456321558",
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    };

    const result = await sendRequest(req);

    expect(result).toStrictEqual(-2);
  });

  test("Deve retornar sucesso", async () => {
    const req = {
      name: "John Doe",
      email: "teste2@example.com",
      cpf: "97456321558",
      carPlate: "ABC1234",
      isDriver: true,
      password: "password123",
    };

    const result = await sendRequest(req);

    expect(result).toStrictEqual({
      accountId: expect.any(String),
    });
  });
});
