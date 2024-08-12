import KafkaConfig from "./KafkaConfig";
import WhatsappClient from "./WhatsappClient";
import MessageConsumer from "./MessageConsumer";


function main() {
  const whatsappClient: WhatsappClient = new WhatsappClient();
  const kafkaConfig = new KafkaConfig();
  const messageConsumer = new MessageConsumer(kafkaConfig, whatsappClient);
  messageConsumer.startConsume()
}

main();