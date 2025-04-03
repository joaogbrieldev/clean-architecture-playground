import { AccountRepositoryDatabase } from "./AccountRepository";

export default class GetAccount {
  constructor(readonly accountRepoisitory: AccountRepositoryDatabase) {}

  async getAccount(accountId: string) {
    const accountData = await this.accountRepoisitory.getAccountById(accountId);
    return accountData;
  }
}
