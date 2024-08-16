import axios from 'axios';
import KafkaConfig from './KafkaConfig';
import ApiResponse from './ApiResponse';
import Offer from './Offer';
import dotenv from 'dotenv';

dotenv.config();

class OffersPoller {
  private kafkaConfig: KafkaConfig;
  private readonly kafkaTopic: string = process.env.KAFKA_TOPIC || 'WHATSAPP-RESPONSES';
  private readonly pollerUrl: string = process.env.POLL_URL || '';
  private readonly pollerInterval: number = parseInt(process.env.POLL_INTERVAL || '300000', 10);
  private lastOfferId: string | null = null;

  constructor(kafkaConfig: KafkaConfig) {
    this.kafkaConfig = kafkaConfig;
  }

  async fetchLatestOffers(): Promise<void> {
    try {
      const apiResponse = await axios.get<ApiResponse>(this.pollerUrl, {
        params: {
          sortBy: 'createdAt',
          perPage: 1,
        },
      });

      const offers = apiResponse.data.offers;
      if (offers && offers.length > 0) {
        const latestOffer: Offer = offers[0];

        if (this.lastOfferId !== latestOffer.id) {
          const response = 'Oferta PHB';
          const mountedBody: string =
            `
            ${latestOffer.title}\n
            Preço: R$${latestOffer.price}\n
            Cupom: ${latestOffer.coupon}\n
            Link: ${latestOffer.url}
            `;

          const kafkaMessageShoot: object = {
              'data': {
                'from': 'phb@g.us',
                'notifyName': 'phb',
                'body': mountedBody,
                'isGroup': true,
                'phbOffer': latestOffer,
              },
          };
          console.log('Nova oferta encontrada. Enviando mensagem...' + JSON.stringify({ kafkaMessageShoot, response }));

          await this.kafkaConfig.produce(this.kafkaTopic, JSON.stringify({ kafkaMessageShoot, response }));
          this.lastOfferId = latestOffer.id;
        } else {
          console.log('A oferta atual é igual à última oferta. Nenhuma mensagem enviada.');
        }
      } else {
        console.log('Nenhuma nova oferta encontrada.');
      }
    } catch (error) {
      console.error('Erro ao verificar atualizações:', error);
    }
  }

  async startPolling(): Promise<void> {
    await this.kafkaConfig.connectProducer();
    console.log('Starting poller of offerts...');
    setInterval(() => this.fetchLatestOffers(), this.pollerInterval);
    this.fetchLatestOffers();
  }
}

export default OffersPoller;