// import { MongoDBHandler } from "./utils/DatabaseHandler";
// import KafkaHandler from "./utils/KafkaHandler";
import { Message } from "whatsapp-web.js";
import WhatsappHandler from "./utils/WhatsappHandler";

const whatsappHandler = new WhatsappHandler();

whatsappHandler.client.on("message", (message: Message) => {
  if (whatsappHandler.verifyIfIsDirectMessage(message)) {
    console.log("Direct message received!");
    // implements logic to handle direct messages with user-api
  }
  console.log("group message received!");
  // implements logic to handle group messages with kafka producing
});

console.log("hello Index");
