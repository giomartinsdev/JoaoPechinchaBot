import KafkaConfig from "./KafkaConfig";
import { BlueSkyHandler } from "./BlueSkyHandler";

import dotenv from "dotenv";
dotenv.config();

export default class BlueSkyWorker {
  private blueSkyHandler: BlueSkyHandler;
  private kafkaConfig: KafkaConfig;
  private kafkaTopic: string;

  constructor(kafkaConfig: KafkaConfig) {
    this.kafkaConfig = kafkaConfig;
    this.blueSkyHandler = new BlueSkyHandler();
    this.kafkaTopic = process.env.KAFKA_TOPIC || "WHATSAPP-RESPONSER";
  }

  async run() {
    try {
      await this.kafkaConfig.subscribe(this.kafkaTopic);
      console.log(`Subscribed to topic: ${this.kafkaTopic}`);
      await this.consumeMessages();
    } catch (error) {
      console.error("Error subscribing to the topic", error);
      return;
    }
  }

  private async consumeMessages() {
    try {
      await this.kafkaConfig.consume((message: string) => {
        console.log("Message consumed: ", message);
      });
    } catch (error) {
      console.error("Error consuming messages");
    }
  }
}
