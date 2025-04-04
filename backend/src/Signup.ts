import Account from "./Account";
import AccountRepository from "./AccountRepository";
import MailerGateway from "./MailerGateway";

// Use case
export default class Signup {
  // DIP - Dependency Inversion Principle
  constructor(
    readonly accountRepository: AccountRepository,
    readonly mailerGateway: MailerGateway
  ) {}

  async execute(input: any) {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.carPlate,
      input.password,
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
