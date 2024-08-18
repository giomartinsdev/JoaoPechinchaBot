import KafkaConfig from './KafkaConfig';
import WhatsappClient from './WhatsappClient';
import MessageRepository from './MessageRepository';
import { PRICE_PATTERN, URL_PATTERN, COUPON_PATTERN, PRODUCT_PATTERN } from './constants';
import dotenv from 'dotenv';

dotenv.config();

export interface ParsedData {
  products: string[];
  prices: string[];
  urls: string[];
  coupons: string[];
  message: string;
}

class MessageConsumer {
  private kafkaConfig: KafkaConfig;
  private whatsappClient: WhatsappClient;
  private messageRepository: MessageRepository;
  private readonly kafkaTopic: string = process.env.KAFKA_TOPIC || 'WHATSAPP-RESPONSES';


  constructor(
    kafkaConfig: KafkaConfig,
    whatsappClient: WhatsappClient,
    messageRepository: MessageRepository
  ) {
    this.kafkaConfig = kafkaConfig;
    this.whatsappClient = whatsappClient;
    this.messageRepository = messageRepository;
  }

  async startConsume(): Promise<void> {
    try {
      await this.kafkaConfig.subscribe(this.kafkaTopic);
      this.consumeMessages();
    } catch (error) {
      console.error('Err subscripting to the topic:', error);
    }
  }

  private async consumeMessages(): Promise<void> {
    try {
      while (true) {
        await this.kafkaConfig.consume(async (message: string) => {
          const { kafkaMessageShoot, response } = JSON.parse(message);
          const { data } = kafkaMessageShoot;

          if (!data?.body) return;

          if (!data.isGroup) { // This is a private message
            await this.responser(data.from, response);
            return;
          }

          const parsedProduct = this.parseMessage(data.body);
          const savedProduct = await this.messageRepository.saveProductOnDB(parsedProduct);
          const memberIds = await this.discoverRequestsForProduct(parsedProduct);

          if (memberIds) {
            await this.notifyMembersAboutProduct(parsedProduct, memberIds);
          } else {
            console.log(`No one member founded to the especified product: ${this.getLastProduct(parsedProduct)}`);
          }
        });

        await this.sleep(1000);
      }
    } catch (error) {
      console.error('Err consuming message:', error);
    }
  }

  private async responser(from: string, response: string): Promise<void> {
    if (this.isGroup(from) || !this.isValidWid(from)) {
      console.error('Invalid wid or group indentified:', from);
      return;
    }

    try {
      await this.whatsappClient.client.sendMessage(from, response);
    } catch (error) {
      console.error('Err sending message:', error);
    }
  }

  private async discoverRequestsForProduct(parsedProduct: ParsedData): Promise<string[] | null> {
    const memberIds = await this.messageRepository.discoverRequestsforTheProduct(parsedProduct);

    if (!memberIds) {
      console.log(`No one member founded to the especified product: ${this.getLastProduct(parsedProduct)}`);
    }

    return memberIds;
  }

  private async notifyMembersAboutProduct(product: ParsedData, members: string[]): Promise<void> {
    for (const member of members) {
      const memberContact = await this.messageRepository.getMemberContact(member);
      await this.responser(
        memberContact,
        `
        OIII, vim te trazer o produto que você tanto buscava!: ${this.getLastProduct(product)}
        \n${product.message}\n
        Obrigado por usar o João Pechincha! 🚀
        `
      );
    }
  }

  private isGroup(from: string): boolean {
    return from.includes('@g.us');
  }

  private isValidWid(wid: string): boolean {
    return /^\d+@c\.us$/.test(wid);
  }

  private parseMessage(message: string): ParsedData {
    return {
      products: (message.match(PRODUCT_PATTERN) || [])
        .map(p => p.trim()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase())
        .filter(Boolean),
      prices: message.match(PRICE_PATTERN) || ['R$0'],
      urls: message.match(URL_PATTERN) || [],
      coupons: Array.from(message.matchAll(COUPON_PATTERN), m => m[1]),
      message
    };
  }

  private getLastProduct(parsedData: ParsedData): string {
    return parsedData.products[parsedData.products.length - 1];
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default MessageConsumer;