import express from "express";
import { Data } from "./data";
import { signup } from "./service";

const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
  const input = req.body;
  try {
    const output = await signup(input);
    res.status(201).json(output);
  } catch (e: any) {
    res.status(422).json({ message: e.message });
  }
});

app.get("/accounts/:accountId", async function (req, res) {
  const output = await Data.getAccountById(req.params.accountId);
  res.status(200).json(output);
});

app.listen(3000);
