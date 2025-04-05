import cors from "cors";
import express, { Request, Response } from "express";

export default interface HttpServer {
  register(method: string, url: string, callback: Function): void;
  lister(port: number): void;
}

export class ExpressAdapter implements HttpServer {
  app: any;
  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }
  lister(port: number): void {
    throw new Error("Method not implemented.");
  }
  register(method: string, url: string, callback: Function): void {
    this.app[method](url, async function (req: Request, res: Response) {
      try {
        const output = await callback(req.params, req.body);
        res.json(output);
      } catch (error: any) {
        res.status(422).json({ message: error.message });
      }
    });
  }
  listen(port: number): void {
    this.app.listen(port);
  }
}
