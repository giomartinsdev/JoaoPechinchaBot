import KafkaConfig from "./KafkaConfig";
import WhatsappClient from "./WhatsappClient";

async function consumeMessages(kafkaConfig: KafkaConfig) {
  await kafkaConfig.subscribe('WHATSAPP-RESPONSES'); 

  while (true) {
    await kafkaConfig.consume((message: string) => {
      console.log(message);
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

function main() {
  const whatsappClient: WhatsappClient = new WhatsappClient();
  const kafkaConfig = new KafkaConfig();

  consumeMessages(kafkaConfig).catch(console.error);
}

main();