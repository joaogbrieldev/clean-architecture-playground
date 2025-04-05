import cors from "cors";
import express from "express";
import { AccountRepositoryDatabase } from "./AccountRepository";
import GetAccount from "./GetAccount";
import { MailerGatewayMemory } from "./MailerGateway";
import Signup from "./Signup";
import DatabaseConnection, {
  PgPromiseAdapter,
} from "./infra/database/DatabaseConnection";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    let connection: DatabaseConnection;
    connection = new PgPromiseAdapter();
    const accountDAO = new AccountRepositoryDatabase(connection);
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const output = await signup.execute(input);
    res.json(output);
  } catch (e: any) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  let connection: DatabaseConnection;
  connection = new PgPromiseAdapter();
  const accountDAO = new AccountRepositoryDatabase(connection);
  const getAccount = new GetAccount(accountDAO);
  const output = await getAccount.execute(req.params.accountId);
  res.json(output);
});

app.listen(3000);
