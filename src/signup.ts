import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());

function validarNome(nome: string) {
  return nome.match(/^[a-zA-Z]+ [a-zA-Z]+$/);
}

function validarEmail(email: string) {
  return email.match(/^(.+)@(.+)$/);
}

function validarDriver(carPlate: string) {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

export async function sendRequest(input: any) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  try {
    const id = crypto.randomUUID();
    const [acc] = await connection.query(
      "select * from ccca.account where email = $1",
      [input.email]
    );
    if (acc) return -4;
    if (!validarNome(input.name)) return -3;
    if (!validarEmail(input.email)) return -2;
    if (!validateCpf(input.cpf)) return -1;
    if (input.isDriver && !validarDriver(input.carPlate))
      throw new Error("Invalid carPlate");

    await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        id,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        !!input.isPassenger,
        !!input.isDriver,
        input.password,
      ]
    );

    return {
      accountId: id,
    };
  } finally {
    await connection.$pool.end();
  }
}

app.post("/signup", async function (req, res) {
  const input = req.body;
  const result = sendRequest(input);
  try {
    if (typeof result === "number") {
      res.status(422).json({ message: result });
    } else {
      res.json(result);
    }
  } catch (e: any) {
    res.status(422).json({ message: e.message });
  }
});

app.listen(3000);
