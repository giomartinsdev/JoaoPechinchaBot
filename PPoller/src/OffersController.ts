import axios from "axios";
import KafkaConfig from "./KafkaConfig";
import dotenv from "dotenv";
import { headers, query } from "./constants";

dotenv.config();

class OffersPoller {
  private kafkaConfig: KafkaConfig;
  private readonly kafkaTopic: string =
    process.env.KAFKA_TOPIC || "WHATSAPP-RESPONSES";
  private readonly pollerUrl2: string = process.env.SECOND_POLL_URL || "";
  private readonly pollerInterval2: number = parseInt(
    process.env.POLL_INTERVAL || "300000",
    10
  );
  private lastOfferId: string | null = null;

  constructor(kafkaConfig: KafkaConfig) {
    this.kafkaConfig = kafkaConfig;
  }

  async fetchLatestOffers(): Promise<void> {
    try {
      const apiResponse = await axios.post(
        this.pollerUrl2,
        JSON.stringify({ query }),
        { headers }
      );

      if (
        apiResponse.data &&
        apiResponse.data.data.offers &&
        apiResponse.data.data.offers.items
      ) {
        const latestOffer = apiResponse.data.data.offers.items[0];
        if (latestOffer) {
          if (this.lastOfferId !== latestOffer.id) {
            const response = "Oferta Pin";

            const formattedPrice = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(latestOffer.price / 100); 

            const mountedBody: string = `
              ${latestOffer.title}\n
              Preço: ${formattedPrice}\n
              Cupom: ${latestOffer.coupon}\n
              Link: ${latestOffer.url}
              `;

            const kafkaMessageShoot: object = {
              from: "pin@g.us",
              notifyName: "pin",
              body: mountedBody,
              isGroup: true,
              pinOffer: latestOffer,
            };
            console.log("New offer found in Poll, sending to queue...");

            await this.kafkaConfig.produce(
              this.kafkaTopic,
              JSON.stringify({ kafkaMessageShoot, response })
            );
            this.lastOfferId = latestOffer.id;
          } else {
            console.log(
              "The actual offer is the same as the last, message not sent."
            );
          }
        } else {
          console.log("No offer found.");
        }
      } else {
        console.log("Unexpected API response format:", apiResponse.data);
      }
    } catch (error) {
      console.error("Error trying to verify updates:", error);
    }
  }

  async startPolling(): Promise<void> {
    console.log("Starting poller...");
    await this.kafkaConfig.connectProducer();
    setInterval(() => this.fetchLatestOffers(), this.pollerInterval2);
    this.fetchLatestOffers();
  }
}

export default OffersPoller;
