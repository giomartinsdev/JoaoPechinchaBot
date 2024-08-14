import KafkaConfig from "./KafkaConfig";
import WhatsappClient from "./WhatsappClient";
import MessageConsumer from "./MessageConsumer";
import MessageRepository from "./MessageRepository";
import DatabaseConnection from "./DatabaseConnection";

function main() {
  const whatsappClient: WhatsappClient = new WhatsappClient();
  const kafkaConfig = new KafkaConfig();
  const databaseConnection = new DatabaseConnection();
  const messageRepository = new MessageRepository(databaseConnection);
  const messageConsumer = new MessageConsumer(kafkaConfig, whatsappClient, messageRepository);
  messageConsumer.startConsume()
}

main();