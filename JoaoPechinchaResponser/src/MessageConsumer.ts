import KafkaConfig from './KafkaConfig';
import WhatsappClient from './WhatsappClient';
import MessageRepository from './MessageRepository';

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
      await this.kafkaConfig.subscribe('WHATSAPP-RESPONSES');
      this.consumeMessages();
    } catch (error) {
      console.error('Erro ao se inscrever no tópico:', error);
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
            console.log(`Não existem membros para este produto: ${this.getLastProduct(parsedProduct)}`);
          }
        });

        await this.sleep(1000);
      }
    } catch (error) {
      console.error('Erro ao consumir mensagem:', error);
    }
  }

  private async responser(from: string, response: string): Promise<void> {
    if (this.isGroup(from) || !this.isValidWid(from)) {
      console.error('wid inválido ou grupo detectado:', from);
      return;
    }

    try {
      await this.whatsappClient.client.sendMessage(from, response);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  }

  private async discoverRequestsForProduct(parsedProduct: ParsedData): Promise<string[] | null> {
    const memberIds = await this.messageRepository.discoverRequestsforTheProduct(parsedProduct);

    if (!memberIds) {
      console.log(`Produto não encontrado: ${this.getLastProduct(parsedProduct)}`);
    }

    return memberIds;
  }

  private async notifyMembersAboutProduct(product: ParsedData, members: string[]): Promise<void> {
    for (const member of members) {
      const memberContact = await this.messageRepository.getMemberContact(member);
      await this.responser(
        memberContact,
        `Produto encontrado: ${this.getLastProduct(product)}\n${product.message}`
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
    const pricePattern = /R\$\s*\d+[\.,]?\d*/g;
    const urlPattern = /https?:\/\/\S+/g;
    const couponPattern = /cupom:\s*[*]?([\w\d]+)[*]?/gi;
    const productPattern = /^(?!.*(R\$|\bpor\b|\bcupom\b|https?:\/\/)).+$/gmi;

    return {
      products: (message.match(productPattern) || []).map(p => p.trim()).filter(Boolean),
      prices: message.match(pricePattern) || [],
      urls: message.match(urlPattern) || [],
      coupons: Array.from(message.matchAll(couponPattern), m => m[1]),
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
