import express from "express";
import dotenv from "dotenv";

import WhatsappHandler from "../utils/WhatsappHandler";

dotenv.config();

export class MailmanApi {
  private app: express.Application;
  private port: number;
  private whatsappHandler: WhatsappHandler;

  constructor(whatsappHandler: WhatsappHandler) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.port = parseInt(process.env.API_PORT || "3000");
    this.whatsappHandler = whatsappHandler;
  }

  start() {
    this.app.get("/", (req, res) => {
      res.send("Hello, world!");
    });

    this.app.post("/process-message", (req, res) => {
      console.log(req.body);

      const isDm: boolean = this.whatsappHandler.verifyIfIsDirectMessage(
        req.body,
      );
      if (isDm) {
        console.log("Direct message received!");
      } else {
        console.log("group message received!");
      }
      res.send("Message processed!");
    });

    this.app.listen(this.port, () => {
      console.log(`mailman-api is running on port ${this.port}`);
    });
  }
}
