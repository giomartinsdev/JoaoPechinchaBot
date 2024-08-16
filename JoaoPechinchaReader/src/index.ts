import WhatsappClient from './WhatsappClient';
import DatabaseConnection from './DatabaseConnection';
import MessageRepository from './MessageRepository';
import MessageHandler from './MessageHandler';
import MyMessage from './MessageInterface';
import KafkaConfig from './KafkaConfig';

async function main() {
  const whatsappClient: WhatsappClient = new WhatsappClient();
  const databaseConnection: DatabaseConnection = new DatabaseConnection();
  const messageRepository: MessageRepository = new MessageRepository(databaseConnection);
  const kafkaConfig = new KafkaConfig();

  await kafkaConfig.connectProducer();

  const messageHandler = new MessageHandler(messageRepository, kafkaConfig);

  whatsappClient.client.on('message', async (message: MyMessage) => {
    await messageHandler.processMessage(message);
  });

}
main();