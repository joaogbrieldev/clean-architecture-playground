import { Data } from "./data";
import { validateCpf } from "./validateCpf";

function validarNome(nome: string) {
  return nome.match(/^[a-zA-Z]+ [a-zA-Z]+$/);
}

function validarEmail(email: string) {
  return email.match(/^(.+)@(.+)$/);
}

function validarDriver(carPlate: string) {
  return carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

export async function signup(input: any) {
  const account = {
    accoundId: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    cpf: input.cpf,
    password: input.password,
    carPlate: input.carPlate,
    isPassenger: input.isPassenger,
    isDriver: input.isDriver,
  };
  const existingAccount = await Data.getAccountByEmail(input.email);
  if (existingAccount) throw new Error("Duplicated account");
  if (!validarNome(input.name)) throw new Error("Invalid name");
  if (!validarEmail(input.email)) throw new Error("Invalid email");
  if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
  if (input.isDriver && !validarDriver(input.carPlate))
    throw new Error("Invalid car plate");

  return {
    accountId: account.accoundId,
  };
}

export async function getAccout(accountId: string) {
  const accountData = await Data.getAccountById(accountId);
  return accountData;
}
