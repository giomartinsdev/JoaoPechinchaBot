import KafkaConfig from './KafkaConfig';
import OffersPoller from './OffersController';

async function main() {
  const kafkaConfig = new KafkaConfig();
  const offersPoller = new OffersPoller(kafkaConfig);
  await offersPoller.startPolling();
}

main();
