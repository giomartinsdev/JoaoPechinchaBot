import BlueSkyWorker from "./BlueSkyWorker";
import KafkaConfig from "./KafkaConfig";

async function main() {
  const kafkaConfig = new KafkaConfig();
  const blueSkyWorker = new BlueSkyWorker(kafkaConfig);
  await blueSkyWorker.run();
}

main();