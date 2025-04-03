import pgp from "pg-promise";
import Account from "./Account";

export default interface AccountRepository {
  saveAccount(account: Account): Promise<void>;
  getAccountByEmail(email: string): Promise<Account | undefined>;
  getAccountById(accountId: string): Promise<Account>;
}

export class AccountRepositoryDatabase implements AccountRepository {
  async getAccountByEmail(email: string): Promise<Account | undefined> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query(
      "select * from ccca.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    if (!accountData) return;
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.car_plate,
      accountData.password,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async getAccountById(accountId: string) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const [accountData] = await connection.query(
      "select * from ccca.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
    return new Account(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.password,
      accountData.car_plate,
      accountData.is_passenger,
      accountData.is_driver
    );
  }

  async saveAccount(account: any) {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    await connection.query(
      "insert into ccca.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, password) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        account.accountId,
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
}

export class AccountDAOMemory implements AccountRepository {
  accounts: any[];

  constructor() {
    this.accounts = [];
  }

  async getAccountByEmail(email: string) {
    return this.accounts.find((account: any) => account.email === email);
  }

  async getAccountById(accountId: string) {
    const account = this.accounts.find(
      (account: any) => account.accountId === accountId
    );
    if (!account) throw new Error("");
    return account;
  }

  async saveAccount(account: any) {
    this.accounts.push(account);
  }
}
