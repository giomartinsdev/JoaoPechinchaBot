import WhatsappClient from './WhatsappClient';
import DatabaseConnection from './DatabaseConnection';
import MessageRepository from './MessageRepository';
import MessageHandler from './MessageHandler';
import MyMessage from './MessageInterface';

function main() {
  const whatsappClient: WhatsappClient = new WhatsappClient();
  const databaseConnection: DatabaseConnection = new DatabaseConnection();
  const messageRepository: MessageRepository = new MessageRepository(databaseConnection);
  const messageHandler: MessageHandler = new MessageHandler(messageRepository, databaseConnection);

  whatsappClient.client.on('message', async (message: MyMessage) => {
    console.log(await messageHandler.processMessage(message))  
  });

};
main()