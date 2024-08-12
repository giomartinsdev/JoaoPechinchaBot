import KafkaConfig from './KafkaConfig';
import WhatsappClient from './WhatsappClient';

class MessageConsumer {
  private kafkaConfig: KafkaConfig;
  private whatsappClient: WhatsappClient;
  constructor(kafkaConfig: KafkaConfig, whatsappClient: WhatsappClient) {
    this.kafkaConfig = kafkaConfig;
    this.whatsappClient = whatsappClient
  }

  async startConsume() {
    try {
      await this.kafkaConfig.subscribe('WHATSAPP-RESPONSES');
    } catch (error) {
      console.error('Erro ao se inscrever no tópico:', error)
    }
    try {
      while (true) {
        await this.kafkaConfig.consume((message: string) => {
          const { kafkaMessageShoot, response } = JSON.parse(message);
          if (!kafkaMessageShoot.data.isGroup) {
            this.responser(kafkaMessageShoot.data.from, response);
           }

          // todo fazer metodo para receber mensagem do grupo salvar no banco e disparar mensagem para os membros que definiram o produto
           
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch(error) {
    console.error('Erro ao consumir mensagem:', error);
  }
  }

  async responser(from: string, response: string) {
    try {
      if (!this.isGroup(from)) {
        await this.whatsappClient.client.sendMessage(from, response);
      }
      return;
    } catch (error) {
      console.error('Erro ao produzir mensagem:', error);
    }

  }

  isGroup(from: string): boolean { 
    return from.split('@')[1] == 'g.us';
  }

}

export default MessageConsumer;