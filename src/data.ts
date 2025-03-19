import pgp from "pg-promise";

export class Data {
  static async getAccountByEmail(email: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query(
      "select * from ccca.accountount where email = $1",
      [email]
    );
    await connection.$pool.end();
    return accountData;
  }

  static async getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query(
      "select * from ccca.accountount where account_od = $1",
      [accountId]
    );
    await connection.$pool.end();
    return accountData;
  }
}

export async function saveAccount(account: any) {
  const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  await connection.query(
    "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
    [
      account.name,
      account.email,
      account.cpf,
      account.carPlate,
      !!account.isPassenger,
      !!account.isDriver,
      account.password,
    ]
  );
  await connection.$pool.end();
}
