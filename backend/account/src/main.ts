// Entry Point - Composition Root

import GetAccount from "./application/usecase/GetAccount";
import Signup from "./application/usecase/Signup";
import AccountController from "./infra/controller/AccountController";
import { PgPromiseAdapter } from "./infra/database/DatabaseConnection";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { ExpressAdapter } from "./infra/http/HttpServer";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";

const httpServer = new ExpressAdapter();
// const httpServer = new HapiAdapter();
const connection = new PgPromiseAdapter();
const accountRepository = new AccountRepositoryDatabase(connection);
const mailerGateway = new MailerGatewayMemory();
const signup = new Signup(accountRepository, mailerGateway);
const getAccount = new GetAccount(accountRepository);
new AccountController(httpServer, signup, getAccount);
httpServer.listen(3000);
