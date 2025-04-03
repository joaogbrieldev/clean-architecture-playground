import Account from "./Account";
import AccountRepository from "./AccountRepository";
import MailerGateway from "./MailerGateway";

export default class Signup {
  constructor(
    readonly accountRepository: AccountRepository,
    readonly mailerGateway: MailerGateway
  ) {}

  async execute(input: any) {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.password,
      input.carPlate,
      input.isPassenger,
      input.isDriver
    );
    const existingAccount = await this.accountRepository.getAccountByEmail(
      account.email
    );
    if (existingAccount) throw new Error("Duplicated account");
    await this.accountRepository.saveAccount(account);
    await this.mailerGateway.send(account.email, "Welcome", "...");
    return {
      accountId: account.accountId,
    };
  }
}
