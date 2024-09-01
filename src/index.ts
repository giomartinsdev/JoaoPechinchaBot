// import { MongoDBHandler } from "./utils/DatabaseHandler";
// import KafkaHandler from "./utils/KafkaHandler";
import { Message } from "whatsapp-web.js";
import WhatsappHandler from "./utils/WhatsappHandler";
import { MailmanApi } from "./mailman-api";
import axios from "axios";

const whatsappHandler = new WhatsappHandler();
const mailmanApi = new MailmanApi(whatsappHandler);

whatsappHandler.client.on("message", async (message: Message) => {
  try {
    const res: Response = await axios.post(
      "http://localhost:3001/process-message",
      message,
    );
    console.log(res);
  } catch (error) {
    console.log("Error: ", { error });
  }
});

mailmanApi.start();

console.log("hello Index");
