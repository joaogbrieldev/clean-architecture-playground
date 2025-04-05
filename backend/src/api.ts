import { AccountRepositoryDatabase } from "./AccountRepository";
import GetAccount from "./GetAccount";
import { ExpressAdapter } from "./HttpServer";
import { MailerGatewayMemory } from "./MailerGateway";
import Signup from "./Signup";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";

const httpServer = new ExpressAdapter();

const connection = new PgPromiseAdapter();

httpServer.register("post", "/signup", async function (params: any, body: any) {
  const accountRepository = new AccountRepositoryDatabase(connection);
  const mailerGateway = new MailerGatewayMemory();
  const signup = new Signup(accountRepository, mailerGateway);
  const output = await signup.execute(body);
  return output;
});

httpServer.register(
  "get",
  "/accounts/:accountId",
  async function (params: any, body: any) {
    const accountRepository = new AccountRepositoryDatabase(connection);
    const getAccount = new GetAccount(accountRepository);
    const output = await getAccount.execute(params);
    return output;
  }
);

httpServer.listen(3000);
