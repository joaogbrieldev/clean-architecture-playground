import Account from "./Account";
import MailerGateway from "./MailerGateway";
import AccountDAO from "./data";

export default class Signup {
  // DIP - Dependency Inversion Principle
  constructor(
    readonly accountDAO: AccountDAO,
    readonly mailerGateway: MailerGateway
  ) {}

  async signup(input: any) {
    const account = Account.create(
      input.name,
      input.email,
      input.cpf,
      input.password,
      input.carPlate,
      input.isPassenger,
      input.isDriver
    );
    const existingAccount = await this.accountDAO.getAccountByEmail(
      account.email
    );
    if (existingAccount) throw new Error("Duplicated account");
    await this.accountDAO.saveAccount(account);
    await this.mailerGateway.send(account.email, "Welcome", "...");
    return {
      accountId: account.accountId,
    };
  }
}

// ISP - Interface Segregation Principle
export interface SignupData {
  saveAccount(account: any): Promise<any>;
  getAccountByEmail(email: string): Promise<any>;
}
