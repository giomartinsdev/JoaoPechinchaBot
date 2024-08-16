import MessageRepository from './MessageRepository';
import MyMessage from './MessageInterface';
import KafkaConfig from './KafkaConfig';
import { PRODUCT_PATTERN, CANCEL_PATTERN } from './constants';
import dotenv from 'dotenv';

dotenv.config();
class MessageHandler {
  private messageRepository: MessageRepository;
  private kafkaProducer: KafkaConfig;
  private readonly kafkaTopic: string = process.env.KAFKA_TOPIC || 'WHATSAPP-RESPONSES';
  
  constructor(messageRepository: MessageRepository, kafkaProducer: KafkaConfig) {
    this.messageRepository = messageRepository;
    this.kafkaProducer = kafkaProducer;
  }

  private isProductMessage(message: string): boolean {
    return PRODUCT_PATTERN.test(message);
  }

  private cancelRequest(message: string): boolean {
    return CANCEL_PATTERN.test(message);
  }

  private async isMember(message: MyMessage): Promise<boolean> {
    const isMember: boolean = await this.messageRepository.verifyIfIsMember(message.id.remote);
    return isMember;
  }

  public async processMessage(message: MyMessage): Promise<void> {
    if (!await this.isMember(message)) {
      await this.produceKafkaMessage(message, 'Por favor, torne-se um membro para continuar.');
      return;
    }

    if (this.cancelRequest(message.body)) {
      if (!await this.messageRepository.cancelRequest(message)) {
        await this.produceKafkaMessage(message, 'Erro ao cancelar solicitacão de rastreio de produto.');
      }
      await this.produceKafkaMessage(message, 'Solicitação de rastreio de produto cancelada.');
      return;
    }

    if (!this.isProductMessage(message.body)) {
      const productString: string = 'Produto: \n Informacoes adicionais: \n Valor máximo: \n';
      await this.produceKafkaMessage(message, `Por favor, informe o texto necessário para cadastrar um produto. ${productString}`);
      return;
    }

    const userRequest: boolean = await this.messageRepository.saveUserRequest(message);
    if (!userRequest) {
      await this.produceKafkaMessage(message, 'Erro ao realizar solicitação.');
    }
    await this.produceKafkaMessage(message, 'Solicitação realizada com sucesso.');
  }

  private async produceKafkaMessage(message: MyMessage, response: string): Promise<void> {
    try {
      const isGroup = message.id.remote.split('@')[1] == 'g.us';
      const kafkaMessageShoot: object = {
        'data': {
          'from': message.id.remote,
          'notifyName': message._data.notifyName,
          'body': message.body,
          'isGroup': isGroup
        }
      };
      await this.kafkaProducer.produce(this.kafkaTopic, JSON.stringify({ kafkaMessageShoot, response }));
    } catch (error) {
      console.error('Error producing Kafka message:', error);
    }
  }
}

export default MessageHandler;