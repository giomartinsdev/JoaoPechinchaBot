import { Kafka, logLevel } from 'kafkajs';
import dotenv from 'dotenv';

dotenv.config();
const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const GROUP_ID = process.env.TEST_GROUP || 'TEST-GROUP';

class KafkaConfig {
  kafka: Kafka;
  producer: any;
  consumer: any;

  constructor() {
    this.kafka = new Kafka({
      brokers: [KAFKA_BROKER],
      logLevel: logLevel.ERROR
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: GROUP_ID });
  }

  async connectProducer() {
    try {
      await this.producer.connect();
    } catch (error) {
      console.error('Err connecting to kafkaConnector:', error);
    }
  }

  async produce(KafkaTopic: string, message: string) {
    try {
      await this.producer.send({
        topic: KafkaTopic,
        messages: [{ value: message }]
      });
    } catch (error) {
      console.log(error);
    }
  }

  async subscribe(KafkaTopic: string) {
    try {
      await this.consumer.connect();
      await this.consumer.subscribe({
        topic: KafkaTopic,
        fromBeginning: true
      });
    } catch (error) {
      console.error('Err subscribing to the topic', error);
    }
  }

  async consume(callback: any) {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }: { topic: string, partition: number, message: any }) => {
          const value = message.value.toString();
          callback(value);
        }
      });
    } catch (error) {
      console.error('Err consuming the topic:', error);
    }
  }
}

export default KafkaConfig;